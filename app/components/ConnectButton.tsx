'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import '@solana/wallet-adapter-react-ui/styles.css';

export function ConnectButton() {
  const { publicKey } = useWallet();

  const displayText = useMemo(() => {
    if (!publicKey) return 'Connect Wallet';
    const address = publicKey.toBase58();
    return `${address.slice(0, 4)}…${address.slice(-4)}`;
  }, [publicKey]);

  return (
    <div className="sen-wallet-wrap">
      <WalletMultiButton
        className={cn(
          // compact size
          'px-3 py-1.5 text-sm font-medium',
          // text & layout
          'inline-flex items-center gap-2 tracking-tight',
        )}
      >
        {displayText}
      </WalletMultiButton>

      {/* Scoped overrides to kill purple theme & add crystal glass */}
      <style jsx>{`
        .sen-wallet-wrap :global(.wallet-adapter-button) {
          /* Base crystal */
          background: linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.08) 0%,
              rgba(255, 255, 255, 0.04) 100%
            ) !important;
          backdrop-filter: blur(8px) saturate(110%) !important;
          -webkit-backdrop-filter: blur(8px) saturate(110%) !important;

          /* Border + subtle halo */
          border: 1px solid rgba(255, 255, 255, 0.14) !important;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.12),
            0 0 0 0 rgba(64, 228, 255, 0),
            0 4px 16px rgba(0, 0, 0, 0.15) !important;
          border-radius: 10px !important;

          /* Typography */
          color: hsl(var(--foreground)) !important;
          line-height: 1 !important;
          height: auto !important;
        }

        /* Remove Solana default icons/caret to keep it minimal */
        .sen-wallet-wrap :global(.wallet-adapter-button-start-icon),
        .sen-wallet-wrap :global(.wallet-adapter-button-end-icon) {
          display: none !important;
        }

        /* Hover/active states */
        .sen-wallet-wrap :global(.wallet-adapter-button:hover) {
          background: linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.12) 0%,
              rgba(255, 255, 255, 0.06) 100%
            ) !important;
          border-color: rgba(79, 229, 255, 0.3) !important;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.16),
            0 0 12px rgba(79, 229, 255, 0.18),
            0 6px 18px rgba(0, 0, 0, 0.18) !important;
          transform: translateZ(0) scale(1.02);
          transition: all 180ms ease;
        }

        .sen-wallet-wrap :global(.wallet-adapter-button:active) {
          transform: translateY(0.5px) scale(0.985);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.12),
            0 0 6px rgba(79, 229, 255, 0.12),
            0 3px 12px rgba(0, 0, 0, 0.22) !important;
        }

        /* Focus ring elegante */
        .sen-wallet-wrap :global(.wallet-adapter-button:focus-visible) {
          outline: none !important;
          box-shadow:
            0 0 0 2px rgba(79, 229, 255, 0.25),
            0 0 0 4px rgba(79, 229, 255, 0.12) !important;
        }

        /* Light/Dark polish */
        @media (prefers-color-scheme: light) {
          .sen-wallet-wrap :global(.wallet-adapter-button) {
            background: linear-gradient(
                180deg,
                rgba(255, 255, 255, 0.6) 0%,
                rgba(255, 255, 255, 0.4) 100%
              ) !important;
            border: 1px solid rgba(0, 0, 0, 0.08) !important;
            box-shadow:
              inset 0 1px 0 rgba(255, 255, 255, 0.8),
              0 6px 16px rgba(0, 0, 0, 0.08) !important;
          }
          .sen-wallet-wrap :global(.wallet-adapter-button:hover) {
            border-color: rgba(0, 0, 0, 0.18) !important;
          }
        }
      `}</style>
    </div>
  );
}
