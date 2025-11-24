import { NextRequest, NextResponse } from 'next/server';
import { registerService } from '../../_services/auth/register';

export async function POST(request: NextRequest) {

  try {
  const body = await request.json();
  const { firstName, lastName, email, password, role } = body;

  console.table(body);

  const newUser = await registerService({
    firstName,
    lastName,
    email,
    password,
    role,
  })

  return NextResponse.json(
    {
      message: 'User registered successfully',

      user: newUser,
      code: 201,
    },
    { status: 201 }
  );
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      {
        message: 'Error registering user',
        code: 500,
      },
      { status: 500 }
    );
  }
}
