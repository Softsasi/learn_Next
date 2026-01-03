import { NextRequest, NextResponse } from 'next/server';
import { auth } from './auth';
import { logger } from './lib/logger';


const PUBLIC_ROUTES = [
  '/',
  '/signin',
  '/signup',
  '/about',
  '/contact',
  '/posts',
  '/users*'
];

async function middleware(req: NextRequest & { auth?: any }) {
  const isAuthenticated = !!req.auth;
  const { pathname } = req.nextUrl;

  console.log(req.auth)

  // Check if the route is public
  const isPublicRoute =
    PUBLIC_ROUTES.includes(pathname) ||
    pathname.startsWith('/posts/') ||
    pathname.startsWith('/users/');

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // If the request is not for a public route, check for an auth token
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }




  // if (!isValidToken) {
  //   return NextResponse.redirect(new URL('/signin?error=invalid_token', req.url));
  // }

  // route protection base on roles
  // if (isAuthenticated && req.auth.user.role !== 'admin'  && pathname.startsWith('/admin')) {
  //   logger.warn(`Unauthorized access attempt to admin route: ${pathname}`);
  //   return NextResponse.redirect(new URL('/unauthorized', req.url));
  // }

  return NextResponse.next();
}

export default auth(middleware)

export const config  = {
  matcher: '/((?!api|_next/static|_next/image|.*\\.png$).*)',
}
