'use client';

import { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

type Props = { children: React.ReactNode };

export function WalletProviderSEN({ children }: Props) {
  // Lee RPC de env o usa 'devnet' por defecto (sin depender de @solana/wallet-adapter-base)
  const endpoint = useMemo(() => {
    const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC;
    return rpcUrl && rpcUrl.length > 0 ? rpcUrl : clusterApiUrl('devnet');
  }, []);

  // Wallets soportadas
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint} config={{ commitment: 'confirmed' }}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
