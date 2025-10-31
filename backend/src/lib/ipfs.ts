import { Web3Storage, File } from 'web3.storage';
import { config } from './config.js';
import logger from './logger.js';
import { ipfsCircuit } from './circuitBreaker.js';

const client = new Web3Storage({ token: config.web3StorageToken });

export async function uploadToIPFS(data: any, filename: string): Promise<string> {
  if (!config.enableIpfsUpload) {
    logger.warn('IPFS upload disabled by feature flag');
    return 'disabled';
  }

  return ipfsCircuit.execute(async () => {
    const buffer = Buffer.from(JSON.stringify(data));
    const file = new File([buffer], filename, { type: 'application/json' });
    const cid = await client.put([file], { name: filename });
    logger.info({ cid, filename }, 'Uploaded to IPFS');
    return cid;
  });
}

export async function uploadReadingBatch(readings: any[]): Promise<string> {
  const filename = `readings-batch-${Date.now()}.json`;
  return uploadToIPFS(readings, filename);
}

export default client;
