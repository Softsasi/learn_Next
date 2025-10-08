'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const getUsers = async () => {
  const users = await prisma.user.findMany();
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
  const res = await prisma.user.delete({
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
