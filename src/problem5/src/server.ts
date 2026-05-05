import { createApp } from './app.js';
import { env } from './config/env.js';
import { prisma } from './db/client.js';

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`Server listening on http://localhost:${env.PORT}`);
});

const shutdown = async (signal: string) => {
  console.log(`Received ${signal}, closing...`);
  server.close(() => {
    prisma.$disconnect().finally(() => process.exit(0));
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
