import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { AnchorProvider, Program, Idl } from '@coral-xyz/anchor';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import senNetworkIdl from './idl/sen_network.json';

export function getEndpoint(): string {
  const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC;
  if (rpcUrl) return rpcUrl;
  return clusterApiUrl('devnet');
}

export function getProgramId(): PublicKey {
  const programIdStr = process.env.NEXT_PUBLIC_SEN_PROGRAM_ID || 'TODO_SET_AFTER_DEPLOY';

  if (programIdStr === 'TODO_SET_AFTER_DEPLOY') {
    throw new Error('SEN Program ID not configured. Set NEXT_PUBLIC_SEN_PROGRAM_ID in .env.local');
  }

  return new PublicKey(programIdStr);
}

export function loadIdl(): Idl {
  return senNetworkIdl as Idl;
}

export function getAnchorProgram(wallet: AnchorWallet): Program {
  const endpoint = getEndpoint();
  const connection = new Connection(endpoint, 'confirmed');
  const provider = new AnchorProvider(connection, wallet, {
    commitment: 'confirmed',
    preflightCommitment: 'confirmed',
  });

  const programId = getProgramId();
  const idl = loadIdl();

  return new Program(idl, programId, provider);
}

export function deriveSensorPda(owner: PublicKey, sensorId: string): [PublicKey, number] {
  const programId = getProgramId();
  return PublicKey.findProgramAddressSync(
    [Buffer.from('sensor'), owner.toBuffer(), Buffer.from(sensorId)],
    programId
  );
}

export function deriveTreasuryPda(sensorPda: PublicKey): [PublicKey, number] {
  const programId = getProgramId();
  return PublicKey.findProgramAddressSync(
    [Buffer.from('treasury'), sensorPda.toBuffer()],
    programId
  );
}

export function deriveReputationPda(sensorPda: PublicKey): [PublicKey, number] {
  const programId = getProgramId();
  return PublicKey.findProgramAddressSync(
    [Buffer.from('rep'), sensorPda.toBuffer()],
    programId
  );
}

export function deriveSubscriptionPda(sensorPda: PublicKey, buyer: PublicKey): [PublicKey, number] {
  const programId = getProgramId();
  return PublicKey.findProgramAddressSync(
    [Buffer.from('sub'), sensorPda.toBuffer(), buyer.toBuffer()],
    programId
  );
}

export function deriveVaultPda(): [PublicKey, number] {
  const programId = getProgramId();
  return PublicKey.findProgramAddressSync(
    [Buffer.from('vault')],
    programId
  );
}
