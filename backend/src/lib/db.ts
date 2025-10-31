import { PrismaClient } from '@prisma/client';
import { config } from './config.js';
import logger from './logger.js';

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: config.nodeEnv === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: config.databaseUrl,
      },
    },
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const db = globalThis.prisma ?? prismaClientSingleton();

if (config.nodeEnv !== 'production') globalThis.prisma = db;

// Graceful shutdown
process.on('beforeExit', async () => {
  logger.info('Disconnecting Prisma client');
  await db.$disconnect();
});

export default db;
