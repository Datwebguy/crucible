"use client"

import { Navbar } from "@/components/Navbar"
import { useTokenBalance } from "@/hooks/useTokenBalance"
import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"

const FEATURES = [
  { free: "3 analyses / day", holder: "Unlimited analyses" },
  { free: "Standard depth", holder: "Extended depth" },
  { free: "No history", holder: "Full history" },
  { free: "No sharing", holder: "Public share links" },
  { free: "—", holder: "Early agent access" },
  { free: "—", holder: "Governance votes" },
]

export default function TokenPage() {
  const { connected, publicKey } = useWallet()
  const { setVisible } = useWalletModal()
  const { isHolder, balance, loading } = useTokenBalance()

  return (
    <div className="min-h-screen bg-[#070609] text-white">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 pt-24 pb-20 space-y-16">
        {/* Hero */}
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400/60 mb-3">Token</p>
          <h1 className="font-heading text-4xl font-bold mb-4">CRUCIBLE Token</h1>
          <p className="font-body text-base text-white/50 leading-relaxed max-w-xl">
            CRUCIBLE is a Solana SPL token. Holding it unlocks unlimited analysis runs, deeper agent outputs, saved history, public sharing, and governance rights over the protocol.
          </p>
        </div>

        {/* Wallet status */}
        <div className="rounded-lg border border-white/[0.06] bg-[#0c0a10] p-6">
          <h2 className="font-heading font-semibold mb-4">Your Status</h2>

          {!connected ? (
            <div className="flex flex-col gap-3">
              <p className="font-body text-sm text-white/40">Connect your Solana wallet to check your CRUCIBLE balance.</p>
              <button
                onClick={() => setVisible(true)}
                className="w-fit font-mono text-xs px-4 py-2 rounded border border-amber-500/50 text-amber-400 hover:bg-amber-500/10 transition-all"
              >
                Connect Wallet
              </button>
            </div>
          ) : loading ? (
            <p className="font-mono text-xs text-white/30 animate-pulse">Checking balance…</p>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${isHolder ? "bg-green-400" : "bg-white/20"}`} />
                <span className="font-mono text-sm">
                  {isHolder ? (
                    <span className="text-green-400">Token Holder — Unlimited Access</span>
                  ) : (
                    <span className="text-white/50">Not a holder — Free Tier</span>
                  )}
                </span>
              </div>
              <p className="font-mono text-xs text-white/30">
                Balance: <span className="text-white/60">{balance.toLocaleString()} CRUCIBLE</span>
              </p>
              <p className="font-mono text-[10px] text-white/20 break-all">
                {publicKey?.toString()}
              </p>
            </div>
          )}
        </div>

        {/* Feature comparison */}
        <div>
          <h2 className="font-heading font-semibold mb-6">Free vs. Holder</h2>
          <div className="rounded-lg border border-white/[0.06] overflow-hidden">
            <div className="grid grid-cols-3 bg-[#0c0a10] border-b border-white/[0.06]">
              <div className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-white/30">Feature</div>
              <div className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-white/30">Free</div>
              <div className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-amber-400/70">Holder</div>
            </div>
            {FEATURES.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-3 border-b border-white/[0.03] last:border-b-0 hover:bg-white/[0.01] transition-colors"
              >
                <div className="px-4 py-3" />
                <div className="px-4 py-3 font-body text-sm text-white/40">{row.free}</div>
                <div className="px-4 py-3 font-body text-sm text-amber-300">{row.holder}</div>
              </div>
            ))}
          </div>
        </div>

        {/* How to get */}
        <div className="rounded-lg border border-amber-500/15 bg-amber-500/[0.02] p-6 space-y-4">
          <h2 className="font-heading font-semibold text-amber-400">How to Get CRUCIBLE</h2>
          <p className="font-body text-sm text-white/50 leading-relaxed">
            CRUCIBLE tokens are available on DexScreener. Once you hold the minimum amount, your wallet will automatically unlock all token holder features on this platform.
          </p>
          <a
            href="https://dexscreener.com/solana/AprqPULHGkpD8uy9K3PtNeJdcVzzyhcFexcmtSg5swrm"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-mono text-xs px-5 py-2.5 rounded bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors"
          >
            Buy $CRUCIBLE on DexScreener →
          </a>
        </div>
      </main>
    </div>
  )
}
