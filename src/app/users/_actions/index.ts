'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getUserProfile(userId: string) {
  try {
    const user = await prisma.userProfile.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            posts: true,
            comments: true,
            postReactions: true,
          }
        },
        authUser: {
          select: {
            role: true,
            createdAt: true,
          }
        }
      }
    });

    if (!user) return { error: 'User not found', success: false };

    return { user, success: true };
  } catch (error) {
    console.error('Get user profile error:', error);
    return { error: 'Failed to fetch user profile', success: false };
  }
}

export async function getUserPosts(userId: string) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        authorId: userId,
        published: true
      },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            comments: true,
            postReactions: true,
          }
        }
      }
    });

    return { posts, success: true };
  } catch (error) {
    console.error('Get user posts error:', error);
    return { error: 'Failed to fetch user posts', success: false };
  }
}

export const getUsers = async () => {
  const users = await prisma.userProfile.findMany();
  if (!users) {
    return null;
  }
  return users;
};

// alternative way to fetch users from API route

// export const getUsers = async () => {
//   const res = await fetch('http://localhost:3000/api/users', {
//     cache: 'no-store',
//   });
//   const users = await res.json();

//   return users;
// };

export const deleteUser = async (userId: string) => {
  const res = await prisma.userProfile.delete({
    where: {
      id: userId,
    },
  });

  // refresh the current page
  revalidatePath('/users');

  // redirect to a specific page
  // redirect('/users');

  return res;
};
