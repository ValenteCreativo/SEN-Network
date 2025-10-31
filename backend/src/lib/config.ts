import dotenv from 'dotenv';
import { AppConfig } from '../types/index.js';

dotenv.config();

function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function getEnvNumber(key: string, defaultValue: number): number {
  const value = process.env[key];
  return value ? parseInt(value, 10) : defaultValue;
}

function getEnvBoolean(key: string, defaultValue: boolean): boolean {
  const value = process.env[key];
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true';
}

export const config: AppConfig = {
  // Server
  port: getEnvNumber('PORT', 3001),
  host: getEnv('HOST', '0.0.0.0'),
  nodeEnv: getEnv('NODE_ENV', 'development'),
  logLevel: getEnv('LOG_LEVEL', 'info'),
  corsOrigin: getEnv('CORS_ORIGIN', 'http://localhost:3000').split(','),

  // Solana
  solanaRpcUrl: getEnv('SOLANA_RPC_URL'),
  solanaRpcFallbackUrl: getEnv('SOLANA_RPC_FALLBACK_URL'),
  anchorWallet: getEnv('ANCHOR_WALLET'),
  senProgramId: getEnv('SEN_PROGRAM_ID', ''),
  usdcMintDevnet: getEnv('USDC_MINT_DEVNET', 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr'),

  // Database
  databaseUrl: getEnv('DATABASE_URL'),
  databasePoolSize: getEnvNumber('DATABASE_POOL_SIZE', 10),

  // Redis
  redisUrl: getEnv('REDIS_URL'),
  redisPassword: getEnv('REDIS_PASSWORD', ''),

  // IPFS
  web3StorageToken: getEnv('WEB3_STORAGE_TOKEN'),
  ipfsGateway: getEnv('IPFS_GATEWAY', 'https://w3s.link/ipfs/'),

  // Security
  jwtSecret: getEnv('JWT_SECRET'),

  // Rate Limiting
  rateLimitEnabled: getEnvBoolean('RATE_LIMIT_ENABLED', true),
  rateLimitMaxRequests: getEnvNumber('RATE_LIMIT_MAX_REQUESTS', 100),
  rateLimitWindowMs: getEnvNumber('RATE_LIMIT_WINDOW_MS', 60000),

  // Circuit Breaker
  circuitBreakerEnabled: getEnvBoolean('CIRCUIT_BREAKER_ENABLED', true),
  circuitBreakerThreshold: getEnvNumber('CIRCUIT_BREAKER_THRESHOLD', 5),
  circuitBreakerTimeout: getEnvNumber('CIRCUIT_BREAKER_TIMEOUT', 30000),

  // Worker
  workerConcurrency: getEnvNumber('WORKER_CONCURRENCY', 5),
  readingArchiveDays: getEnvNumber('READING_ARCHIVE_DAYS', 30),

  // WebSocket
  wsEnabled: getEnvBoolean('WS_ENABLED', true),
  wsPort: getEnvNumber('WS_PORT', 3002),
  wsHeartbeatInterval: getEnvNumber('WS_HEARTBEAT_INTERVAL', 30000),

  // Feature Flags
  enableSignatureVerification: getEnvBoolean('ENABLE_SIGNATURE_VERIFICATION', true),
  enableIpfsUpload: getEnvBoolean('ENABLE_IPFS_UPLOAD', true),
  enableOnChainSubmission: getEnvBoolean('ENABLE_ON_CHAIN_SUBMISSION', true),
};
