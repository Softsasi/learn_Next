'use server';

import { prisma } from '@/lib/prisma';
import { ContactType } from '../types';



export async function formAction(data: ContactType) {
  console.log(data);

  const dbData = await prisma.contact.create({
    data: {
      name: data.name,
      email: data.email,
      message: data.message,
      title: data.title,
    },
  });

  console.table(dbData);

  return {
    success: true,
    data: dbData,
  };
}
