import AppConfig from '@/config/appConfig';
import { prisma } from '@/lib/prisma';
import * as argon2 from 'argon2';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Parse the request body
  const body = await request.json();
  const { firstName, lastName, email, password } = body;

  console.table(body);

  console.time('hashingTime');
  // hash password before storing it
  const hashedPassword = await argon2.hash(password, {
    salt: Buffer.from(AppConfig.argon2dSalt),
    secret: Buffer.from(AppConfig.argon2Secret),
    type: argon2.argon2id,
  });
  console.timeEnd('hashingTime');

  // Create new user in the database
  const newUser = await prisma.authUser.create({
    data: {
      email,
      password: hashedPassword,
      user: {
        create: {
          firstName,
          lastName,
        },
      },
    },
    omit: {
      password: true,
      updatedAt: true,
    },
  });

  return NextResponse.json(
    {
      message: 'User registered successfully',
      user: newUser,
      code: 201,
    },
    { status: 201 }
  );
}
