"use server";

import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

export const verifyEmailAction = async (code: string) => {
  // step 1: Find the verification code in the database
    const verifyResult = await prisma.verificationCode.findFirst({
    where: {
     code
    }
  })

  if (!verifyResult) {
    logger.warn('Verification failed for code:', {code});
    return { success: false, message: 'Invalid verification code' };
  }

  // step 2: Check if the code has expired
  const now = new Date();

  if (verifyResult.expiresAt < now) {
    logger.warn('Verification code expired:', {code});
    return { success: false, message: 'Verification code has expired' };
  }

  // step 3: Update the user's emailVerified status

  await prisma.authUser.update({
    where: {
      id: verifyResult.userId
    },
    data: {
      emailVerified: true
    }
  })





}
