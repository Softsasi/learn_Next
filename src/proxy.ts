import { NextRequest, NextResponse } from 'next/server';
import { auth } from './auth';


const PUBLIC_ROUTES = [
  '/',
  '/signin',
  '/signup',
  '/about',
  '/contact',
  '/posts',
  //  '/posts/:path*'
]

 async function  middleware(req: NextRequest & { auth?: any }) {
     const isAuthenticated = !!req.auth;

  // Allow the request to proceed if it's for a public route
  if (PUBLIC_ROUTES.includes(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // If the request is not for a public route, check for an auth token
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  // if (!isValidToken) {
  //   return NextResponse.redirect(new URL('/signin?error=invalid_token', req.url));
  // }

  return NextResponse.next();
}

export default auth(middleware)

export const config  = {
  matcher: '/((?!api|_next/static|_next/image|.*\\.png$).*)',
}
