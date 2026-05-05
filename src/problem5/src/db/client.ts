import { PrismaClient } from '@prisma/client';

const log =
  process.env.NODE_ENV === 'test'
    ? []
    : process.env.NODE_ENV === 'development'
      ? (['warn', 'error'] as const)
      : (['error'] as const);

export const prisma = new PrismaClient({ log: [...log] });
