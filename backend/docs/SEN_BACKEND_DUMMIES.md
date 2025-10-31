# SEN NETWORK Backend - Developer Guide

**For Dummies Edition**: Everything you need to run, understand, and extend the SEN Network backend.

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Architecture Overview](#architecture-overview)
3. [Environment Setup](#environment-setup)
4. [Running the Backend](#running-the-backend)
5. [API Endpoints](#api-endpoints)
6. [Database Schema](#database-schema)
7. [Workers & Job Queues](#workers--job-queues)
8. [Solana Integration](#solana-integration)
9. [Common Tasks](#common-tasks)
10. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose
- PostgreSQL 16
- Redis 7
- Solana CLI (for Anchor deployment)

### 30-Second Setup

```bash
# 1. Clone and navigate to backend
cd backend

# 2. Install dependencies
npm install

# 3. Copy environment template
cp ../.env.example .env

# 4. Start databases with Docker
docker-compose up -d postgres redis

# 5. Run database migrations
npm run db:migrate

# 6. Start backend server
npm run dev

# 7. (Optional) Start worker processes
npm run worker
```

**Backend will be running at**: `http://localhost:3001`

**Health check**: `curl http://localhost:3001/health`

---

## Architecture Overview

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                      SEN NETWORK BACKEND                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │
│  │   Fastify    │───▶│   Prisma     │───▶│ PostgreSQL   │ │
│  │  HTTP Server │    │     ORM      │    │   Database   │ │
│  └──────────────┘    └──────────────┘    └──────────────┘ │
│         │                                                    │
│         ▼                                                    │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │
│  │   BullMQ     │───▶│    Redis     │───▶│  Job Queues  │ │
│  │   Workers    │    │    Cache     │    │  + Caching   │ │
│  └──────────────┘    └──────────────┘    └──────────────┘ │
│         │                                                    │
│         ▼                                                    │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │
│  │   Anchor     │───▶│   Solana     │───▶│ SPL-USDC     │ │
│  │   Client     │    │   Devnet     │    │  Payments    │ │
│  └──────────────┘    └──────────────┘    └──────────────┘ │
│         │                                                    │
│         ▼                                                    │
│  ┌──────────────┐    ┌──────────────┐                      │
│  │ Web3.Storage │───▶│     IPFS     │                      │
│  │   Client     │    │   Archive    │                      │
│  └──────────────┘    └──────────────┘                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Sensor Registration**: Owner → API → Database → Anchor Program → PDA Creation
2. **Reading Upload**: Sensor → API → Signature Verification → Queue → IPFS → Anchor Hash
3. **Payment Flow**: Buyer → Anchor Program → USDC Transfer (95% treasury, 5% vault) → API → Access Grant
4. **Subscription**: Buyer → Anchor Program → Monthly USDC → API → Redis Access Token
5. **Data Access**: Buyer → API (with access token) → Redis verification → Data retrieval

---

## Environment Setup

### Required Environment Variables

**Solana Configuration**:
```env
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_RPC_FALLBACK_URL=https://api.devnet.solana.com
SEN_PROGRAM_ID=TODO_SET_AFTER_DEPLOY
USDC_MINT=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v  # Devnet USDC
```

**Database & Cache**:
```env
DATABASE_URL=postgresql://sen_user:sen_password@localhost:5432/sen_network
REDIS_URL=redis://localhost:6379
```

**IPFS Integration**:
```env
WEB3_STORAGE_TOKEN=your_web3_storage_api_token
```

**Server Configuration**:
```env
NODE_ENV=development
PORT=3001
LOG_LEVEL=debug
```

**Feature Flags**:
```env
RATE_LIMIT_ENABLED=true
CIRCUIT_BREAKER_ENABLED=true
```

### Getting API Keys

**Web3.Storage** (IPFS):
1. Visit: https://web3.storage
2. Sign up for free account
3. Create API token
4. Copy to `WEB3_STORAGE_TOKEN`

**Solana RPC** (Optional - for production):
1. Use Helius, QuickNode, or Alchemy
2. Get dedicated RPC endpoint
3. Update `SOLANA_RPC_URL`

---

## Running the Backend

### Development Mode

**Option 1: Docker Compose (Recommended)**
```bash
# Start all services (PostgreSQL, Redis, Backend, Worker)
docker-compose up

# Or run in background
docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f worker

# Stop all services
docker-compose down
```

**Option 2: Local Services**
```bash
# Terminal 1: Start databases
docker-compose up postgres redis

# Terminal 2: Run migrations and start backend
npm run db:migrate
npm run dev

# Terminal 3: Start worker processes
npm run worker
```

### Production Mode

```bash
# Build TypeScript
npm run build

# Run database migrations
npm run db:migrate

# Start production server
npm run start

# Start production worker
NODE_ENV=production npm run worker
```

### Useful Commands

```bash
# Database operations
npm run db:migrate        # Run Prisma migrations
npm run db:generate       # Generate Prisma client
npm run db:studio         # Open Prisma Studio (database GUI)
npm run db:seed           # Seed database with test data

# Development
npm run dev               # Start dev server with hot reload
npm run worker            # Start worker processes
npm run test              # Run tests (when implemented)

# Utilities
npm run lint              # Run ESLint
npm run format            # Format code with Prettier
```

---

## API Endpoints

### Base URL
`http://localhost:3001`

### 1. Register Sensor

**POST** `/sensors/register`

Registers a new IoT sensor in the system.

**Request Body**:
```json
{
  "name": "Temperature Sensor #1",
  "type": "temperature",
  "location": "Building A, Floor 3",
  "publicKey": "ABC123...",
  "pricePerQuery": 0.01,
  "monthlySubscription": 5.0
}
```

**Response**:
```json
{
  "id": "clx...",
  "name": "Temperature Sensor #1",
  "ownerWallet": "7xKX...y8Qz",
  "onChainAddress": "SEN...",
  "status": "active"
}
```

**Validation**:
- `name`: 1-100 characters
- `type`: One of: temperature, humidity, air_quality, co2, noise, light, motion
- `pricePerQuery`: Positive number
- `monthlySubscription`: Positive number
- `publicKey`: Valid Ed25519 public key (base58)

---

### 2. Upload Reading

**POST** `/readings/upload`

Uploads a signed sensor reading.

**Request Body**:
```json
{
  "sensorId": "clx...",
  "timestamp": 1735599600,
  "value": 22.5,
  "signature": "ABC123..."
}
```

**Response**:
```json
{
  "id": "reading_123",
  "sensorId": "clx...",
  "verified": true,
  "ipfsCid": "bafybei...",
  "onChainHash": "0x123..."
}
```

**Validation**:
- `signature`: Valid Ed25519 signature over `{sensorId}:{timestamp}:{value}`
- `timestamp`: Unix timestamp (not future)
- `value`: Numeric sensor reading

**Processing Flow**:
1. Validate signature against sensor's public key
2. Store in PostgreSQL
3. Queue for IPFS upload
4. Queue for on-chain hash submission

---

### 3. Pay Per Query

**POST** `/payments/query`

Records a pay-per-query payment (after on-chain tx).

**Request Body**:
```json
{
  "sensorId": "clx...",
  "buyerWallet": "9xKX...a1Bz",
  "txSignature": "5xYZ..."
}
```

**Response**:
```json
{
  "accessToken": "grant:clx...:9xKX:1735599600",
  "expiresIn": 3600,
  "reading": { /* latest reading data */ }
}
```

**Access Control**:
- Verifies on-chain payment transaction
- Creates Redis access token (1 hour TTL)
- Returns access token for data retrieval

---

### 4. Subscribe

**POST** `/subscriptions/subscribe`

Creates or renews a subscription (after on-chain tx).

**Request Body**:
```json
{
  "sensorId": "clx...",
  "planType": "monthly",
  "buyerWallet": "9xKX...a1Bz",
  "txSignature": "5xYZ..."
}
```

**Response**:
```json
{
  "id": "sub_123",
  "active": true,
  "expiresAt": "2025-02-01T00:00:00Z",
  "accessToken": "grant:clx...:9xKX:1735599600"
}
```

**Plan Types**:
- `monthly`: 30-day access
- `yearly`: 365-day access

---

### 5. Get Readings

**GET** `/readings/:sensorId`

Retrieves sensor readings (requires access token).

**Headers**:
```
Authorization: Bearer grant:clx...:9xKX:1735599600
```

**Query Parameters**:
- `limit`: Number of readings (default: 100)
- `offset`: Pagination offset (default: 0)
- `from`: Start timestamp (optional)
- `to`: End timestamp (optional)

**Response**:
```json
{
  "readings": [
    {
      "timestamp": 1735599600,
      "value": 22.5,
      "verified": true
    }
  ],
  "total": 1000,
  "hasMore": true
}
```

---

### 6. Market Sensors

**GET** `/market/sensors`

Lists all active sensors available for purchase.

**Query Parameters**:
- `type`: Filter by sensor type
- `minReputation`: Minimum reputation score
- `maxPrice`: Maximum price per query

**Response**:
```json
{
  "sensors": [
    {
      "id": "clx...",
      "name": "Temperature Sensor #1",
      "type": "temperature",
      "pricePerQuery": 0.01,
      "monthlySubscription": 5.0,
      "reputation": {
        "score": 850,
        "uptime": 99.5,
        "totalReadings": 10000
      }
    }
  ]
}
```

---

### 7. Health Checks

**GET** `/health`

Basic health check.

**Response**: `{ "status": "ok" }`

**GET** `/ready`

Readiness check (verifies database, Redis, RPC).

**Response**:
```json
{
  "status": "ready",
  "checks": {
    "database": "ok",
    "redis": "ok",
    "solana": "ok"
  }
}
```

---

### 8. WebSocket

**WS** `/ws`

Real-time sensor data stream.

**Connection**:
```javascript
const ws = new WebSocket('ws://localhost:3001/ws');

// Subscribe to sensor
ws.send(JSON.stringify({
  type: 'subscribe',
  sensorId: 'clx...',
  accessToken: 'grant:...'
}));

// Receive readings
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('New reading:', data);
};
```

**Message Types**:
- `subscribe`: Subscribe to sensor channel
- `unsubscribe`: Unsubscribe from sensor
- `ping`: Keepalive ping
- `pong`: Keepalive pong

---

## Database Schema

### Core Tables

**User**
```prisma
model User {
  wallet       String   @id  // Solana wallet address
  createdAt    DateTime
  sensors      Sensor[]
  reputation   UserReputation?
}
```

**Sensor**
```prisma
model Sensor {
  id                    String   @id
  name                  String
  type                  String   // temperature, humidity, etc.
  ownerWallet           String
  publicKey             String   // Ed25519 for signature verification
  onChainAddress        String?  // Sensor PDA on Solana
  pricePerQuery         Float
  monthlySubscription   Float
  status                String   // active, suspended
  readings              Reading[]
  subscriptions         Subscription[]
  reputation            SensorReputation?
}
```

**Reading**
```prisma
model Reading {
  id           String   @id
  sensorId     String
  timestamp    Int      // Unix timestamp
  value        Float
  ipfsCid      String?  // IPFS content ID
  onChainHash  String?  // Blake3 hash submitted on-chain
  signature    String   // Ed25519 signature
  verified     Boolean  @default(false)
  createdAt    DateTime
}
```

**ArchivedReading**
```prisma
model ArchivedReading {
  id           String   @id
  sensorId     String
  batchCid     String   // IPFS CID of archived batch
  startDate    DateTime
  endDate      DateTime
  readingCount Int
  archived     Boolean  @default(false)
  createdAt    DateTime
}
```

**Subscription**
```prisma
model Subscription {
  id           String   @id
  sensorId     String
  buyerWallet  String
  planType     String   // monthly, yearly
  amount       Float
  active       Boolean  @default(true)
  startedAt    DateTime
  expiresAt    DateTime
  txSignature  String?
}
```

**Payment**
```prisma
model Payment {
  id           String   @id
  sensorId     String
  buyerWallet  String
  amount       Float
  paymentType  String   // query, subscription
  txSignature  String   @unique
  createdAt    DateTime
}
```

**SensorReputation**
```prisma
model SensorReputation {
  sensorId         String   @id
  score            Int      @default(0)     // -1000 to +1000
  uptime           Float    @default(0.0)   // 0.0 to 100.0
  totalReadings    Int      @default(0)
  verifiedReadings Int      @default(0)
  flaggedCount     Int      @default(0)
  lastCalculated   DateTime
}
```

**AccessGrant** (stored in Redis, not PostgreSQL)
```
Key: grant:{sensorId}:{buyerWallet}:{timestamp}
Value: { sensorId, buyerWallet, grantType, expiresAt }
TTL: 3600 seconds (1 hour) for query, 2592000 (30 days) for subscription
```

---

## Workers & Job Queues

### Worker Types

**1. Ingest Worker**
- **Queue**: `ingest-queue`
- **Purpose**: Upload readings to IPFS
- **Jobs**: `{ readingId, sensorId, data }`
- **Processing**:
  1. Fetch reading from database
  2. Upload to Web3.Storage
  3. Update reading with IPFS CID

**2. Reputation Worker**
- **Queue**: `reputation-queue`
- **Purpose**: Calculate sensor reputation scores
- **Jobs**: `{ sensorId, eventType }`
- **Processing**:
  1. Aggregate reading statistics
  2. Calculate uptime percentage
  3. Compute reputation score
  4. Update SensorReputation table

**3. Billing Worker**
- **Queue**: `billing-queue`
- **Purpose**: Process subscription renewals
- **Jobs**: `{ subscriptionId, action }`
- **Processing**:
  1. Check subscription expiry
  2. Verify on-chain payment
  3. Renew or expire subscription
  4. Send notifications

**4. Archive Worker**
- **Queue**: `archive-queue`
- **Purpose**: Archive old readings to IPFS
- **Jobs**: `{ sensorId, olderThan }`
- **Processing**:
  1. Query readings older than 30 days
  2. Batch readings (1000 per batch)
  3. Upload batch to IPFS
  4. Create ArchivedReading record
  5. Delete old readings from PostgreSQL

### Queue Management

```typescript
// Add job to queue
import { ingestQueue } from './lib/queues';

await ingestQueue.add('upload-reading', {
  readingId: 'reading_123',
  sensorId: 'sensor_456',
  data: { timestamp: 1735599600, value: 22.5 }
});

// Process jobs
ingestWorker.process(async (job) => {
  const { readingId, data } = job.data;
  // Upload to IPFS...
  return { success: true, cid: 'bafybei...' };
});
```

---

## Solana Integration

### Anchor Program

**Program ID**: Set in `SEN_PROGRAM_ID` env var after deployment

**Instructions**:
1. `register_sensor`: Creates sensor PDA, treasury PDA, reputation PDA
2. `submit_hash`: Submits reading hash on-chain
3. `pay_per_query`: Transfers USDC (95% treasury, 5% vault)
4. `subscribe`: Creates subscription PDA
5. `withdraw_earnings`: Sensor owner withdraws from treasury
6. `update_reputation`: Updates reputation score (5-min cooldown)

### PDA Derivation

```typescript
import { getProgramId, deriveSensorPda } from './lib/anchor';

// Sensor PDA
const [sensorPda, bump] = deriveSensorPda(ownerPublicKey, sensorId);

// Treasury PDA
const [treasuryPda] = deriveTreasuryPda(sensorPda);

// Reputation PDA
const [reputationPda] = deriveReputationPda(sensorPda);

// Subscription PDA
const [subscriptionPda] = deriveSubscriptionPda(sensorPda, buyerPublicKey);
```

### Circuit Breaker

Protects against RPC failures with automatic fallback:

```typescript
import { executeRpcCall } from './lib/anchor';

const blockHeight = await executeRpcCall(
  async (connection) => connection.getBlockHeight(),
  'getBlockHeight'
);
```

**States**:
- **CLOSED**: Normal operation
- **OPEN**: Too many failures, use fallback RPC
- **HALF_OPEN**: Testing if primary RPC recovered

**Configuration**:
- Failure threshold: 5 failures
- Timeout: 30 seconds
- Reset timeout: 60 seconds
- Retry backoff: 100ms → 2000ms (exponential)

---

## Common Tasks

### Adding a New API Endpoint

1. **Define Zod schema** in `src/types/index.ts`:
```typescript
export const MyRequestSchema = z.object({
  field1: z.string(),
  field2: z.number()
});
```

2. **Create route handler** in `src/routes/`:
```typescript
export async function myRoute(fastify: FastifyInstance) {
  fastify.post('/my-endpoint', async (request, reply) => {
    const data = MyRequestSchema.parse(request.body);
    // Handle request...
    return { success: true };
  });
}
```

3. **Register route** in `src/server.ts`:
```typescript
import { myRoute } from './routes/my-route';
await fastify.register(myRoute);
```

### Adding a Database Model

1. **Edit Prisma schema** in `prisma/schema.prisma`:
```prisma
model MyModel {
  id        String   @id @default(cuid())
  field1    String
  field2    Int
  createdAt DateTime @default(now())
}
```

2. **Create and run migration**:
```bash
npx prisma migrate dev --name add_my_model
```

3. **Generate Prisma client**:
```bash
npm run db:generate
```

### Adding a Worker

1. **Create worker file** in `src/workers/`:
```typescript
import { Worker } from 'bullmq';
import { redis } from '../lib/redis';

export const myWorker = new Worker('my-queue', async (job) => {
  const { data } = job.data;
  // Process job...
  return { success: true };
}, { connection: redis });
```

2. **Register worker** in `src/workers/index.ts`:
```typescript
import { myWorker } from './my-worker';
// Worker will start processing automatically
```

---

## Troubleshooting

### Problem: Backend won't start

**Error**: `ECONNREFUSED` connecting to PostgreSQL

**Solution**:
```bash
# Check if PostgreSQL is running
docker-compose ps

# Start PostgreSQL if stopped
docker-compose up -d postgres

# Check logs
docker-compose logs postgres
```

---

### Problem: Database migration fails

**Error**: `Migration failed: relation already exists`

**Solution**:
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Or drop manually and re-migrate
docker-compose down -v
docker-compose up -d postgres
npm run db:migrate
```

---

### Problem: Anchor program not found

**Error**: `Program 11111111111111111111111111111111 not found`

**Solution**:
1. Deploy Anchor program first:
```bash
cd ../
anchor build
anchor deploy
```

2. Copy Program ID to `.env`:
```env
SEN_PROGRAM_ID=<your-program-id>
```

3. Restart backend

---

### Problem: RPC rate limit exceeded

**Error**: `429 Too Many Requests`

**Solution**:
1. Use dedicated RPC provider (Helius, QuickNode)
2. Configure fallback RPC:
```env
SOLANA_RPC_URL=https://your-primary-rpc.com
SOLANA_RPC_FALLBACK_URL=https://api.devnet.solana.com
```

---

### Problem: IPFS upload fails

**Error**: `Invalid Web3.Storage token`

**Solution**:
1. Get API token from https://web3.storage
2. Update `.env`:
```env
WEB3_STORAGE_TOKEN=your_actual_token
```

---

### Problem: Worker not processing jobs

**Solution**:
```bash
# Check Redis connection
docker-compose logs redis

# Check worker logs
npm run worker

# Inspect queue in Redis
docker exec -it sen_redis redis-cli
> KEYS bull:*
> LLEN bull:ingest-queue:wait
```

---

## Next Steps

1. **Deploy Anchor Program**: See `programs/sen_network/README.md`
2. **Implement API Endpoints**: See Phase 4 in project plan
3. **Implement Workers**: See Phase 5 in project plan
4. **Integration Testing**: See Phase 7 in project plan
5. **Production Deployment**: Configure Dockerfile and environment

---

## Support & Resources

- **Documentation**: `/backend/docs/`
- **API Reference**: This file
- **Prisma Studio**: `npm run db:studio`
- **Logs**: Check Docker Compose logs or `backend/logs/`

**Questions?** Check the main project README or create an issue on GitHub.
