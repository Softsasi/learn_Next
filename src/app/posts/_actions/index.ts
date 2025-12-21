'use server';

import { auth } from '@/auth';
import { ReactionType } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function incrementViewCount(postId: string) {
  try {
    // Increment view count in database
    await prisma.post.update({
      where: { id: postId },
      data: { viewCount: { increment: 1 } },
    });

    return { success: true };
  } catch (error) {
    console.error('View count error:', error);
    return { success: false };
  }
}

export async function toggleBookmark(postId: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: 'You must be logged in to bookmark posts', code: 401 };
    }

    const userId = session.user.id;

    // Use a transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Check if bookmark already exists
      const existingBookmark = await tx.postBookmark.findUnique({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      });

      if (existingBookmark) {
        // Remove bookmark
        await tx.postBookmark.delete({
          where: {
            postId_userId: {
              postId,
              userId,
            },
          },
        });
        return { bookmarked: false };
      } else {
        // Add bookmark
        await tx.postBookmark.create({
          data: {
            postId,
            userId,
          },
        });
        return { bookmarked: true };
      }
    });

    revalidatePath(`/posts/${postId}`);
    return { success: true, ...result };
  } catch (error) {
    console.error('Bookmark error:', error);
    return { error: 'Failed to update bookmark', code: 500 };
  }
}

export async function getBookmarkStatus(postId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { bookmarked: false };

    const bookmark = await prisma.postBookmark.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: session.user.id,
        },
      },
    });

    return { bookmarked: !!bookmark };
  } catch (error) {
    return { bookmarked: false };
  }
}

export async function toggleReaction(postId: string, type: ReactionType) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: 'You must be logged in to react to posts', code: 401 };
    }

    const userId = session.user.id;

    const result = await prisma.$transaction(async (tx) => {
      const existingReaction = await tx.postReaction.findUnique({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      });

      if (existingReaction) {
        if (existingReaction.type === type) {
          // Remove reaction if same type
          await tx.postReaction.delete({
            where: {
              postId_userId: {
                postId,
                userId,
              },
            },
          });

          await tx.post.update({
            where: { id: postId },
            data: { likeCount: { decrement: 1 } },
          });

          return { reacted: false, type: null };
        } else {
          // Update reaction type
          const updated = await tx.postReaction.update({
            where: {
              postId_userId: {
                postId,
                userId,
              },
            },
            data: { type },
          });
          return { reacted: true, type: updated.type };
        }
      } else {
        // Create new reaction
        const created = await tx.postReaction.create({
          data: {
            postId,
            userId,
            type,
          },
        });

        await tx.post.update({
          where: { id: postId },
          data: { likeCount: { increment: 1 } },
        });

        return { reacted: true, type: created.type };
      }
    });

    revalidatePath(`/posts/${postId}`);
    return { success: true, ...result };
  } catch (error) {
    console.error('Reaction error:', error);
    return { error: 'Failed to update reaction', code: 500 };
  }
}

export async function getPostReaction(postId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { reaction: null };

    const reaction = await prisma.postReaction.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: session.user.id,
        },
      },
    });

    return { reaction: reaction?.type || null };
  } catch (error) {
    return { reaction: null };
  }
}

export async function getComments(postId: string) {
  try {
    // Fetch all comments for this post to build a tree on the client or server
    const allComments = await prisma.comment.findMany({
      where: {
        postId,
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        commentReactions: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Build the comment tree
    const commentMap = new Map();
    const rootComments: any[] = [];

    allComments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    allComments.forEach(comment => {
      const commentWithReplies = commentMap.get(comment.id);
      if (comment.parentCommentId && commentMap.has(comment.parentCommentId)) {
        const parent = commentMap.get(comment.parentCommentId);
        parent.replies.push(commentWithReplies);
      } else {
        rootComments.push(commentWithReplies);
      }
    });

    return {
      comments: rootComments,
      totalCount: allComments.length,
      success: true
    };
  } catch (error) {
    console.error('Get comments error:', error);
    return { error: 'Failed to fetch comments', success: false };
  }
}

export async function addComment(postId: string, content: string, parentCommentId?: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: 'You must be logged in to comment', success: false };
    }

    const userId = session.user.id;

    const comment = await prisma.$transaction(async (tx) => {
      const newComment = await tx.comment.create({
        data: {
          content,
          postId,
          authorId: userId,
          parentCommentId: parentCommentId || null,
        },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
        },
      });

      // Increment comment count on post
      await tx.post.update({
        where: { id: postId },
        data: { commentCount: { increment: 1 } },
      });

      return newComment;
    });

    revalidatePath(`/posts/${postId}`);
    return { comment, success: true };
  } catch (error) {
    console.error('Add comment error:', error);
    return { error: 'Failed to add comment', success: false };
  }
}

export async function toggleCommentReaction(commentId: string, type: ReactionType) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: 'You must be logged in to react', success: false };
    }

    const userId = session.user.id;

    const result = await prisma.$transaction(async (tx) => {
      const existingReaction = await tx.commentReaction.findUnique({
        where: {
          commentId_userId: {
            commentId,
            userId,
          },
        },
      });

      if (existingReaction) {
        if (existingReaction.type === type) {
          // Remove reaction if same type
          await tx.commentReaction.delete({
            where: {
              commentId_userId: {
                commentId,
                userId,
              },
            },
          });
          return { reacted: false, type: null };
        } else {
          // Update reaction type
          const updated = await tx.commentReaction.update({
            where: {
              commentId_userId: {
                commentId,
                userId,
              },
            },
            data: { type },
          });
          return { reacted: true, type: updated.type };
        }
      } else {
        // Create new reaction
        const created = await tx.commentReaction.create({
          data: {
            commentId,
            userId,
            type,
          },
        });
        return { reacted: true, type: created.type };
      }
    });

    return { ...result, success: true };
  } catch (error) {
    console.error('Comment reaction error:', error);
    return { error: 'Failed to update reaction', success: false };
  }
}
