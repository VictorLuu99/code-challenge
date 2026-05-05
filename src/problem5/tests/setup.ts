import { execSync } from 'node:child_process';
import { config } from 'dotenv';
import { beforeAll, beforeEach, afterAll } from 'vitest';

config({ path: '.env.test', override: true });

const { prisma } = await import('../src/db/client.js');

beforeAll(() => {
  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
  });
});

beforeEach(async () => {
  await prisma.task.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
