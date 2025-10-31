'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { cn } from '@/lib/utils';

// ⛔️ No importes el CSS global aquí. Va en app/layout.tsx

export function ConnectButton() {
  return (
    <div className="sen-wallet-wrap">
      <WalletMultiButton
        className={cn(
          // compact size
          'px-3 py-1.5 text-sm font-medium',
          // text & layout
          'inline-flex items-center gap-2 tracking-tight'
        )}
      />

      {/* Scoped overrides: estilos visuales sin cambiar el árbol del DOM */}
      <style jsx>{`
        .sen-wallet-wrap :global(.wallet-adapter-button) {
          background: linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.08) 0%,
              rgba(255, 255, 255, 0.04) 100%
            ) !important;
          backdrop-filter: blur(8px) saturate(110%) !important;
          -webkit-backdrop-filter: blur(8px) saturate(110%) !important;
          border: 1px solid rgba(255, 255, 255, 0.14) !important;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.12),
            0 4px 16px rgba(0, 0, 0, 0.15) !important;
          border-radius: 10px !important;
          color: hsl(var(--foreground)) !important;
          line-height: 1 !important;
          height: auto !important;
        }

        .sen-wallet-wrap :global(.wallet-adapter-button-start-icon),
        .sen-wallet-wrap :global(.wallet-adapter-button-end-icon) {
          display: none !important;
        }

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

        .sen-wallet-wrap :global(.wallet-adapter-button:focus-visible) {
          outline: none !important;
          box-shadow:
            0 0 0 2px rgba(79, 229, 255, 0.25),
            0 0 0 4px rgba(79, 229, 255, 0.12) !important;
        }

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
