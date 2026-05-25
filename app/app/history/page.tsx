"use client"

import { useEffect, useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Navbar } from "@/components/Navbar"
import { TokenGate } from "@/components/TokenGate"
import { SavedAnalysisCard } from "@/components/SavedAnalysisCard"
import type { AnalysisResult } from "@/types"

type SavedAnalysis = AnalysisResult & { id: string; createdAt: string }

export default function HistoryPage() {
  const { publicKey, connected } = useWallet()
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!connected || !publicKey) return

    async function load() {
      setLoading(true)
      try {
        const res = await fetch("/api/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ walletAddress: publicKey!.toString() }),
        })
        if (!res.ok) return
        const data = await res.json()
        setAnalyses(data.analyses || [])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [connected, publicKey])

  return (
    <div className="min-h-screen bg-[#070609] text-white">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 pt-24 pb-20">
        <div className="mb-10">
          <h1 className="font-heading text-2xl font-bold mb-1">Analysis History</h1>
          <p className="font-body text-sm text-white/40">Your saved analyses.</p>
        </div>

        <TokenGate>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <span className="font-mono text-xs text-white/30 animate-pulse">Loading…</span>
            </div>
          ) : analyses.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-body text-sm text-white/30">No saved analyses yet.</p>
              <a
                href="/app"
                className="inline-block mt-4 font-mono text-xs text-amber-400 hover:underline"
              >
                Run your first analysis →
              </a>
            </div>
          ) : (
            <div className="space-y-3">
              {analyses.map((analysis) => (
                <SavedAnalysisCard key={analysis.id} analysis={analysis} />
              ))}
            </div>
          )}
        </TokenGate>
      </main>
    </div>
  )
}
