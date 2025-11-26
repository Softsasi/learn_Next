import RegisterEmailTemplate from '@/components/templates/register-email';
import AppConfig from '@/config/appConfig';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';
import { ResendEmailService } from '@/lib/resend';
import * as argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';

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

  logger.info(`New user registered: ${newUser.email} with role ${newUser.role}`);

  // Generate verification code
  const verificationCode = uuidv4();
  const expirationHours = typeof AppConfig.VERIFICATION_LINK_EXPIRES_IN === 'string'
    ? parseInt(AppConfig.VERIFICATION_LINK_EXPIRES_IN, 10)
    : AppConfig.VERIFICATION_LINK_EXPIRES_IN;
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + expirationHours);

  try {
    // Create verification code record
    await prisma.verificationCode.create({
      data: {
        userId: newUser.id,
        code: verificationCode,
        type: 'ACCOUNT_ACTIVATION',
        expiresAt,
        status: 'PENDING',
      },
    });

    logger.info(`Verification code created for user: ${newUser.email}`);

    // Build verification link
    const verificationLink = `${AppConfig.appUrl}/verify-email?code=${verificationCode}`;

    // Send verification email
    const { messageId, success } = await ResendEmailService.sendEmail({
      to: newUser.email,
      subject: 'Welcome to LearnHub - Verify Your Email',
      jsx: RegisterEmailTemplate({
        firstName,
        email: newUser.email,
        verificationLink,
      }),
    });

    if (success && messageId) {
      logger.info(`Verification email sent successfully to ${newUser.email} (Message ID: ${messageId})`);
    } else {
      logger.warn(`Failed to send verification email to ${newUser.email}, but registration completed`);
    }
  } catch (emailError) {
    logger.error(
      `Error sending verification email for ${newUser.email}:`,
      emailError instanceof Error ? emailError.message : String(emailError)
    );

  }

  return newUser;
};
