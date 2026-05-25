"use client"

import { useMemo } from "react"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { SolflareWalletAdapter } from "@solana/wallet-adapter-wallets"
import "@solana/wallet-adapter-react-ui/styles.css"

const RPC = process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.mainnet-beta.solana.com"

export function WalletProviders({ children }: { children: React.ReactNode }) {
  // Phantom auto-registers via Wallet Standard — no need to add PhantomWalletAdapter explicitly
  const wallets = useMemo(
    () => [new SolflareWalletAdapter()],
    []
  )

  return (
    <ConnectionProvider endpoint={RPC}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
