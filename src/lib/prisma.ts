import { PrismaClient } from '../generated/prisma';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  (() => {
    const client = new PrismaClient();

    if (process.env.NODE_ENV !== 'production') {
      global.prisma = client;
    }

    return client;
  })();

if (process.env.NODE_ENV !== 'production' && !global.prisma) {
  global.prisma = prisma;
}
