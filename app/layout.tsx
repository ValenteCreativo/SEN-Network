import type React from "react";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

// CSS globales
import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";

// Importa el provider tal como lo exportas (nombrado en tu caso)
import { WalletProviderSEN } from "./providers/WalletProvider";

const inter = Inter({ subsets: ["latin"] });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SEN NETWORK - The Sensor Economy on Solana",
  description:
    "Earn from your sensors. Access verifiable environmental data. Accelerate open climate intelligence.",
  generator: "Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className}>
        <WalletProviderSEN>{children}</WalletProviderSEN>
      </body>
    </html>
  );
}
