import { verifyToken } from '@/utils/jwt';
import { cookies } from 'next/headers';

export interface IUserPayload {
  userId: string;
  email: string;
  role: string;
  avatarUrl: any;
  firstName: string;
  lastName: string;
  iat: number;
  exp: number;
}

export async function authDetails() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('auth_token')?.value || null;

  if (!authToken) {
    return null;
  }

  const decodedToken = verifyToken(authToken);
  return decodedToken as IUserPayload;
}

export async function destroyAuth() {
  const cookieStore = await cookies();
  cookieStore.delete({
    name: 'auth_token',
    path: '/',
  });

  return;
}
