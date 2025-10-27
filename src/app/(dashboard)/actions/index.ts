'use server';

import { prisma } from '@/lib/prisma';

export async function getUserInfo(userId: string) {
  const user = await prisma.authUser.findUnique({
    where: { id: userId },

    select: {
      id: true,
      email: true,
      role: true,
      verified: true,
      user: {
        omit: {
          updatedAt: true,
          createdAt: true,
        },
      },
    },
  });

  if (!user) {
    return {
      error: 'User not found',
      code: 404,
    };
  }

  return {
    user,
    code: 200,
  };
}
