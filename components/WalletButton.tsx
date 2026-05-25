"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { useTokenBalance } from "@/hooks/useTokenBalance"

export function WalletButton() {
  const { connected, publicKey, disconnect } = useWallet()
  const { setVisible } = useWalletModal()
  const { isHolder } = useTokenBalance()

  if (connected && publicKey) {
    const short = `${publicKey.toString().slice(0, 4)}…${publicKey.toString().slice(-4)}`
    return (
      <div className="flex items-center gap-2">
        {isHolder && (
          <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
            TOKEN HOLDER
          </span>
        )}
        <button
          onClick={() => disconnect()}
          className="font-mono text-xs px-3 py-1.5 rounded border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors"
        >
          {short}
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setVisible(true)}
      className="font-mono text-xs px-4 py-2 rounded border border-amber-500/50 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500 transition-all"
    >
      Connect Wallet
    </button>
  )
}
