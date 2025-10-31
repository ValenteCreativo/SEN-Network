import * as anchor from '@coral-xyz/anchor';
import { Program, AnchorProvider, Wallet } from '@coral-xyz/anchor';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { readFileSync } from 'fs';
import { config } from './config.js';
import logger from './logger.js';
import { solanaRpcCircuit } from './circuitBreaker.js';
import type { SenNetwork } from '../../../target/types/sen_network';
import idl from '../../../app/lib/idl/sen_network.json' assert { type: 'json' };

// Load wallet
let wallet: Wallet;
try {
  const keypairData = JSON.parse(readFileSync(config.anchorWallet, 'utf-8'));
  const keypair = Keypair.fromSecretKey(new Uint8Array(keypairData));
  wallet = new Wallet(keypair);
} catch (error) {
  logger.error({ error }, 'Failed to load Anchor wallet');
  throw error;
}

// Create connection with circuit breaker and fallback
function createConnection(useFallback = false): Connection {
  const endpoint = useFallback ? config.solanaRpcFallbackUrl : config.solanaRpcUrl;
  return new Connection(endpoint, 'confirmed');
}

let primaryConnection = createConnection(false);
let fallbackConnection = createConnection(true);

// Create provider with circuit breaker wrapper
const provider = new AnchorProvider(
  primaryConnection,
  wallet,
  { commitment: 'confirmed' }
);

anchor.setProvider(provider);

// Initialize program
const programId = new PublicKey(config.senProgramId || idl.metadata?.address || 'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS');
export const program = new Program(idl as any, programId, provider) as Program<SenNetwork>;

// Wrapped RPC call with circuit breaker and fallback
export async function executeRpcCall<T>(
  fn: (connection: Connection) => Promise<T>,
  operationName: string
): Promise<T> {
  return solanaRpcCircuit.execute(
    async () => {
      logger.debug({ operation: operationName }, 'Executing RPC call on primary');
      return await fn(primaryConnection);
    },
    async () => {
      logger.warn({ operation: operationName }, 'Primary RPC failed, using fallback');
      return await fn(fallbackConnection);
    }
  );
}

// PDA derivation helpers
export function deriveSensorPda(owner: PublicKey, sensorId: string): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('sensor'), owner.toBuffer(), Buffer.from(sensorId)],
    program.programId
  );
}

export function deriveTreasuryPda(sensorPda: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('treasury'), sensorPda.toBuffer()],
    program.programId
  );
}

export function deriveSubscriptionPda(sensorPda: PublicKey, buyer: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('sub'), sensorPda.toBuffer(), buyer.toBuffer()],
    program.programId
  );
}

export function deriveReputationPda(sensorPda: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('rep'), sensorPda.toBuffer()],
    program.programId
  );
}

export function deriveVaultPda(usdcMint: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('vault'), usdcMint.toBuffer()],
    program.programId
  );
}

// Submit reading hash to chain
export async function submitReadingHash(
  sensorId: string,
  ownerWallet: string,
  readingHash: Buffer,
  timestamp: number
): Promise<string> {
  const owner = new PublicKey(ownerWallet);
  const [sensorPda] = deriveSensorPda(owner, sensorId);
  const [reputationPda] = deriveReputationPda(sensorPda);

  return executeRpcCall(async (connection) => {
    const tx = await program.methods
      .submitHash(Array.from(readingHash), new anchor.BN(timestamp))
      .accounts({
        sensor: sensorPda,
        reputation: reputationPda,
        owner,
      })
      .rpc();

    logger.info({ sensorId, tx }, 'Reading hash submitted to chain');
    return tx;
  }, 'submitReadingHash');
}

// Update reputation score
export async function updateReputationScore(
  sensorId: string,
  ownerWallet: string,
  scoreDelta: number
): Promise<string> {
  const owner = new PublicKey(ownerWallet);
  const [sensorPda] = deriveSensorPda(owner, sensorId);
  const [reputationPda] = deriveReputationPda(sensorPda);

  return executeRpcCall(async (connection) => {
    const tx = await program.methods
      .updateReputation(scoreDelta)
      .accounts({
        sensor: sensorPda,
        reputation: reputationPda,
        authority: wallet.publicKey,
      })
      .rpc();

    logger.info({ sensorId, scoreDelta, tx }, 'Reputation updated on chain');
    return tx;
  }, 'updateReputation');
}

export { wallet, provider, primaryConnection, fallbackConnection };
