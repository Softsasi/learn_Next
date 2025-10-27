import { prisma } from '@/lib/prisma';
import { toISODateTime } from '@/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest) {
  const body = await req.json();

  const { userId, firstName, lastName, dob, bio, email, role, phone, address } =
    body;

  const updateData = {};

  try {
    const res = await prisma.userProfile.update({
      where: {
        id: userId,
      },
      data: {
        firstName,
        lastName,
        address,
        dob: toISODateTime(dob),
        phone,
        bio,
      },
    });
  } catch (err) {
    console.error('Error updating user profile:', err);
    return NextResponse.json(
      { message: 'Failed to update profile', status: 500 },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: 'Profile updated successfully',
    data: {},
    status: 200,
  });
}
