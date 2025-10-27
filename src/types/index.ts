import { Role as UserRole } from '@/generated/prisma';

export type Role = UserRole;

export interface IUserProfile {
  id: string;
  firstName: string;
  lastName: string;
  dob?: string;
  bio?: string;
  phone?: string;
  address?: string;
}

export interface IUser {
  id: string;
  email: string;
  role: Role;
  verified: boolean;
  user: IUserProfile;
}
