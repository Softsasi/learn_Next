import AppConfig from '@/config/appConfig';
import { prisma } from '@/lib/prisma';
import * as argon2 from 'argon2';
import { NextRequest } from 'next/server';
export async function POST(request: NextRequest) {
  // Parse the request body
  const body = await request.json();
  const { email, password } = body;

  console.table(body);

  // find user in database

  const existUser = await prisma.user.findUnique({
    where: {
      email: email,
    },

    select: {
      id: true,
      email: true,
      password: true,
    },
  });

  if (!existUser) {
    return new Response(JSON.stringify({ message: 'User not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  console.log('existUser:', existUser);

  const isPasswordValid = await argon2.verify(existUser.password, password, {
    secret: Buffer.from(AppConfig.argon2Secret),
  });

  console.log('isPasswordValid:', isPasswordValid);

  if (!isPasswordValid) {
    return new Response(JSON.stringify({ message: 'Invalid credentials' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(
    JSON.stringify({
      message: 'Login successful',
      userId: existUser.id,
      email: existUser.email,
      code: 200,
    }),
    {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
