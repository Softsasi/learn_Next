import { NextRequest, NextResponse } from 'next/server';
import { logger } from './lib/logger';
import { verifyToken } from './utils/jwt';


const PUBLIC_ROUTES = [
  '/',
  '/signin',
  '/signup',
  '/about',
  '/contact',
  '/posts',
  //  '/posts/:path*'
]

export async function  proxy(request: NextRequest) {
  logger.log(request.headers.get('user-agent'));

  const cookies = request.headers.get('cookie') || '';
  const authToken = cookies?.split('=')[1]?.split(';')[0];

  // Allow the request to proceed if it's for a public route
  if (PUBLIC_ROUTES.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // If the request is not for a public route, check for an auth token
  if (!authToken) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // validate the auth token here (this is just a placeholder, implement your own logic)
  const isValidToken = await verifyToken(authToken);
  logger.log('Token valid:', isValidToken);

  if (!isValidToken) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // If the request has an auth token, allow it to proceed
  return NextResponse.next();
}

export const config  = {
  matcher: '/((?!api|_next/static|_next/image|.*\\.png$).*)',
}
