import AppConfig from '@/config/appConfig';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';
import * as argon2 from 'argon2';



type IRegisterUser = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: any;
};

export const registerService = async ({
  firstName,
  lastName,
  email,
  password,
  role,
}: IRegisterUser) => {
  console.time('hashingTime');
  // hash password before storing it
  const hashedPassword = await argon2.hash(password, {
    salt: Buffer.from(AppConfig.argon2dSalt),
    secret: Buffer.from(AppConfig.argon2Secret),
    type: argon2.argon2id,
  });
  console.timeEnd('hashingTime');

  // Create new user in the database
  const newUser = await prisma.authUser.create({
    data: {
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role.toUpperCase(),
      user: {
        create: {
          firstName,
          lastName,
        },
      },
    },
    omit: {
      password: true,
      updatedAt: true,
    },
  });


  // send verification email here (omitted for brevity)
   logger.info(`New user registered: ${newUser.email} with role ${newUser.role}`);

  return newUser;
}
