import AppConfig from '@/config/appConfig';
import { LoginAttemptStatus } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { generateToken } from '@/utils/jwt';
import * as argon2 from 'argon2';

type LoginHistory = {
  userId: string;
  userAgent: string | undefined;
  ipAddress: string | undefined;
  attempt: LoginAttemptStatus;
};

const createLoginHistory = async (loginHistory: LoginHistory) => {
  await prisma.loginHistory.create({
    data: {
      userId: loginHistory.userId,
      userAgent: loginHistory.userAgent,
      ipAddress: loginHistory.ipAddress,
      attempt: loginHistory.attempt,
    },
  });
};



export const loginService = async(email: string, password: string, userAgent: string, ipAddress: string)=>{

  // step 1: find user in database by email
   const existUser = await prisma.authUser.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true,
      email: true,
      password: true,
      role: true,
      user: {
        select: {
          avatarUrl: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

    if (!existUser) {
    return new Response(JSON.stringify({ message: 'User not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }



    const isPasswordValid = await argon2.verify(existUser.password, password, {
      secret: Buffer.from(AppConfig.argon2Secret),
    });

    if (!isPasswordValid) {
      await createLoginHistory({
        userId: existUser.id,
        userAgent: userAgent,
        ipAddress: ipAddress,
        attempt: LoginAttemptStatus.FAILED,
      });

      return new Response(JSON.stringify({ message: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await createLoginHistory({
    userId: existUser.id,
    userAgent: userAgent,
    ipAddress: ipAddress,
    attempt: LoginAttemptStatus.SUCCESS,
  });

    const date = {
      userId: existUser.id,
      email: existUser.email,
      role: existUser.role,
      avatarUrl: existUser.user?.avatarUrl,
      firstName: existUser.user?.firstName,
      lastName: existUser.user?.lastName,
    };

    const token = generateToken(
      date,
      AppConfig.JWT_EXPIRES_IN as unknown as number
    );


    return { date, token };
}
