import AppConfig from '@/config/appConfig';
import { prisma } from '@/lib/prisma';
import * as argon2 from 'argon2';
import { NextRequest } from 'next/server';

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

  const newUser = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
    },
    // select: {
    //   id: true,
    //   firstName: true,
    //   lastName: true,
    // },
    omit: {
      password: true,
      updatedAt: true,
    },
  });

  return new Response(JSON.stringify(newUser), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function GET() {
  const users = await prisma.user.findMany();

  return new Response(JSON.stringify(users), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
