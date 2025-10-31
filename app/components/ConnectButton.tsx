'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';

export function ConnectButton() {
  const { publicKey } = useWallet();

  const displayText = useMemo(() => {
    if (!publicKey) return 'Conectar Wallet';

    const address = publicKey.toBase58();
    return `${address.slice(0, 4)}…${address.slice(-4)}`;
  }, [publicKey]);

  return (
    <WalletMultiButton
      className={cn(
        "!bg-primary !text-primary-foreground hover:!bg-primary/90",
        "!font-semibold !transition-all !duration-300 hover:!scale-105",
        "glow-primary !rounded-md !px-4 !py-2"
      )}
    >
      {displayText}
    </WalletMultiButton>
  );
}
