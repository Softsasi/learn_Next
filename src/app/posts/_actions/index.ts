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
