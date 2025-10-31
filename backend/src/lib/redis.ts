import Redis from 'ioredis';
import { config } from './config.js';
import logger from './logger.js';

export const redis = new Redis(config.redisUrl, {
  password: config.redisPassword || undefined,
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  reconnectOnError(err) {
    const targetError = 'READONLY';
    if (err.message.includes(targetError)) {
      return true;
    }
    return false;
  },
});

redis.on('connect', () => {
  logger.info('Redis connected');
});

redis.on('error', (err) => {
  logger.error({ err }, 'Redis error');
});

redis.on('close', () => {
  logger.warn('Redis connection closed');
});

// Graceful shutdown
process.on('beforeExit', async () => {
  logger.info('Disconnecting Redis');
  await redis.quit();
});

// Helper: Set access grant with TTL
export async function setAccessGrant(
  sensorId: string,
  buyerWallet: string,
  grantType: 'query' | 'subscription',
  ttlSeconds: number
): Promise<string> {
  const token = `grant:${sensorId}:${buyerWallet}:${Date.now()}`;
  await redis.setex(token, ttlSeconds, JSON.stringify({ sensorId, buyerWallet, grantType }));
  return token;
}

// Helper: Verify access grant
export async function verifyAccessGrant(token: string): Promise<{
  valid: boolean;
  data?: { sensorId: string; buyerWallet: string; grantType: string };
}> {
  const data = await redis.get(token);
  if (!data) {
    return { valid: false };
  }
  return { valid: true, data: JSON.parse(data) };
}

// Helper: Cache latest sensor reading
export async function cacheLatestReading(sensorId: string, reading: any): Promise<void> {
  await redis.setex(`reading:latest:${sensorId}`, 300, JSON.stringify(reading));
}

// Helper: Get cached latest reading
export async function getCachedReading(sensorId: string): Promise<any | null> {
  const data = await redis.get(`reading:latest:${sensorId}`);
  return data ? JSON.parse(data) : null;
}

export default redis;
