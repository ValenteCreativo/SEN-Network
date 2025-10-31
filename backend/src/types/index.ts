import { z } from 'zod';

// ============================================
// Sensor Schemas
// ============================================

export const SensorTypeSchema = z.enum([
  'AQI',
  'Temperature',
  'Noise',
  'Traffic',
  'Humidity',
]);

export const SensorStatusSchema = z.enum([
  'active',
  'offline',
  'pending',
  'suspended',
]);

export const RegisterSensorSchema = z.object({
  name: z.string().min(1).max(100),
  type: SensorTypeSchema,
  location: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  publicKey: z.string(), // Ed25519 public key (base58)
  frequency: z.number().int().positive().optional(),
  pricePerQuery: z.number().positive().default(0.01),
  monthlySubscription: z.number().positive().default(5.0),
});

export const RotateKeySchema = z.object({
  sensorId: z.string(),
  newPublicKey: z.string(), // New Ed25519 public key (base58)
  signature: z.string(), // Signature with old key proving ownership
});

// ============================================
// Reading Schemas
// ============================================

export const UploadReadingSchema = z.object({
  sensorId: z.string(),
  timestamp: z.number().int(), // Unix timestamp
  value: z.number(),
  metadata: z.record(z.any()).optional(),
  signature: z.string(), // Ed25519 signature (base58)
});

export const QueryReadingsSchema = z.object({
  sensorId: z.string(),
  startTime: z.number().int().optional(),
  endTime: z.number().int().optional(),
  limit: z.number().int().min(1).max(1000).default(100),
  offset: z.number().int().min(0).default(0),
});

// ============================================
// Payment Schemas
// ============================================

export const PayPerQuerySchema = z.object({
  sensorId: z.string(),
  txSignature: z.string(), // Solana transaction signature
});

export const SubscribeSchema = z.object({
  sensorId: z.string(),
  plan: z.enum(['monthly', 'yearly']),
  txSignature: z.string(), // Solana transaction signature
});

// ============================================
// Market Schemas
// ============================================

export const MarketFilterSchema = z.object({
  type: SensorTypeSchema.optional(),
  status: SensorStatusSchema.optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  location: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
  sortBy: z.enum(['price', 'reputation', 'uptime', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// ============================================
// Type Exports
// ============================================

export type SensorType = z.infer<typeof SensorTypeSchema>;
export type SensorStatus = z.infer<typeof SensorStatusSchema>;
export type RegisterSensorInput = z.infer<typeof RegisterSensorSchema>;
export type RotateKeyInput = z.infer<typeof RotateKeySchema>;
export type UploadReadingInput = z.infer<typeof UploadReadingSchema>;
export type QueryReadingsInput = z.infer<typeof QueryReadingsSchema>;
export type PayPerQueryInput = z.infer<typeof PayPerQuerySchema>;
export type SubscribeInput = z.infer<typeof SubscribeSchema>;
export type MarketFilterInput = z.infer<typeof MarketFilterSchema>;

// ============================================
// Configuration Types
// ============================================

export interface AppConfig {
  // Server
  port: number;
  host: string;
  nodeEnv: string;
  logLevel: string;
  corsOrigin: string[];

  // Solana
  solanaRpcUrl: string;
  solanaRpcFallbackUrl: string;
  anchorWallet: string;
  senProgramId: string;
  usdcMintDevnet: string;

  // Database
  databaseUrl: string;
  databasePoolSize: number;

  // Redis
  redisUrl: string;
  redisPassword: string;

  // IPFS
  web3StorageToken: string;
  ipfsGateway: string;

  // Security
  jwtSecret: string;

  // Rate Limiting
  rateLimitEnabled: boolean;
  rateLimitMaxRequests: number;
  rateLimitWindowMs: number;

  // Circuit Breaker
  circuitBreakerEnabled: boolean;
  circuitBreakerThreshold: number;
  circuitBreakerTimeout: number;

  // Worker
  workerConcurrency: number;
  readingArchiveDays: number;

  // WebSocket
  wsEnabled: boolean;
  wsPort: number;
  wsHeartbeatInterval: number;

  // Feature Flags
  enableSignatureVerification: boolean;
  enableIpfsUpload: boolean;
  enableOnChainSubmission: boolean;
}

// ============================================
// WebSocket Message Types
// ============================================

export interface WSMessage {
  type: 'subscribe' | 'unsubscribe' | 'reading' | 'heartbeat' | 'error';
  sensorId?: string;
  data?: any;
  timestamp?: number;
}

export interface WSReadingMessage {
  sensorId: string;
  timestamp: number;
  value: number;
  verified: boolean;
}
