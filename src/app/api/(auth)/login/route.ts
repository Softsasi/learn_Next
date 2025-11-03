import AppConfig from '@/config/appConfig';
import { LoginAttemptStatus } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import * as argon2 from 'argon2';
import { NextRequest, NextResponse } from 'next/server';

import { generateToken } from '@/utils/jwt';

type LoginHistory = {
  userId: string;
  userAgent: string | undefined;
  ipAddress: string | undefined;
  attempt: LoginAttemptStatus;
};

const createLoginHistory = async (loginHistory: LoginHistory) => {
  await prisma.loginHistory.create({
    data: {
      userId: loginHistory.userId,
      userAgent: loginHistory.userAgent,
      ipAddress: loginHistory.ipAddress,
      attempt: loginHistory.attempt,
    },
  });
};

export async function POST(request: NextRequest) {
  // Parse the request body
  const body = await request.json();
  const { email, password } = body;

  const ipAddress = request.headers.get('x-forwarded-for') || 'Unknown';
  const userAgent = request.headers.get('user-agent') || 'Unknown';

  // find user in database by email
  const existUser = await prisma.authUser.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true,
      email: true,
      password: true,
      role: true,
      user: {
        select: {
          avatarUrl: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  if (!existUser) {
    return new Response(JSON.stringify({ message: 'User not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const isPasswordValid = await argon2.verify(existUser.password, password, {
    secret: Buffer.from(AppConfig.argon2Secret),
  });

  if (!isPasswordValid) {
    await createLoginHistory({
      userId: existUser.id,
      userAgent: userAgent,
      ipAddress: ipAddress,
      attempt: LoginAttemptStatus.FAILED,
    });

    return new Response(JSON.stringify({ message: 'Invalid credentials' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  await createLoginHistory({
    userId: existUser.id,
    userAgent: userAgent,
    ipAddress: ipAddress,
    attempt: LoginAttemptStatus.SUCCESS,
  });

  const date = {
    userId: existUser.id,
    email: existUser.email,
    role: existUser.role,
    avatarUrl: existUser.user?.avatarUrl,
    firstName: existUser.user?.firstName,
    lastName: existUser.user?.lastName,
  };

  const token = generateToken(
    date,
    AppConfig.JWT_EXPIRES_IN as unknown as number
  );

  const response = NextResponse.json(
    {
      message: 'Login successful',
      ...date,
      code: 200,
    },
    {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    }
  );

  response.cookies.set({
    name: 'auth_token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  });

  return response;
}
