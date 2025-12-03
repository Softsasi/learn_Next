import { NextRequest, NextResponse } from 'next/server';
import { loginService } from '../../_services/auth/login';

export async function POST(request: NextRequest) {
  // Parse the request body
  const body = await request.json();
  const { email, password } = body;

  const ipAddress = request.headers.get('x-forwarded-for') || 'Unknown';
  const userAgent = request.headers.get('user-agent') || 'Unknown';



  const loginResult = await loginService(email, password, userAgent, ipAddress);


  if (loginResult instanceof Response) {
    return loginResult;
  }


  const response = NextResponse.json(
    {
      message: 'Login successful',
      ...loginResult.date,
      code: 200,
    },
    {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    }
  );

  response.cookies.set({
    name: 'auth_token',
    value: loginResult.token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  });

  return response;
}
