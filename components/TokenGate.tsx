"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { useTokenBalance } from "@/hooks/useTokenBalance"

interface TokenGateProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function TokenGate({ children, fallback }: TokenGateProps) {
  const { connected } = useWallet()
  const { isHolder, loading } = useTokenBalance()
  const { setVisible } = useWalletModal()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="font-mono text-xs text-white/30 animate-pulse">Checking token balance…</div>
      </div>
    )
  }

  if (!connected || !isHolder) {
    return (
      fallback ?? (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <div className="w-12 h-12 rounded-full border border-amber-500/30 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L3 7v6l7 5 7-5V7L10 2z" stroke="#E8720A" strokeWidth="1.5" fill="none" />
              <circle cx="10" cy="10" r="2" fill="#E8720A" />
            </svg>
          </div>
          <div className="space-y-1">
            <p className="font-heading font-semibold text-white">Token Holder Access Required</p>
            <p className="font-body text-sm text-white/40">
              Hold CRUCIBLE tokens to unlock this feature.
            </p>
          </div>
          {!connected && (
            <button
              onClick={() => setVisible(true)}
              className="font-mono text-xs px-4 py-2 rounded border border-amber-500/50 text-amber-400 hover:bg-amber-500/10 transition-all"
            >
              Connect Wallet
            </button>
          )}
        </div>
      )
    )
  }

  return <>{children}</>
}
