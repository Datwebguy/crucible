"use client"

import { useState } from "react"

const EXAMPLES = [
  "I'm going to ape into this new DeFi protocol because the APY is 900% and the team is doxxed. The tokenomics look solid and CT is bullish.",
  "I think SOL will 10x this cycle because institutional adoption is growing, the ecosystem is expanding, and the last bear market proved it can survive.",
  "This DAO proposal to use 30% of treasury for marketing makes sense because we need more users and the bear market is over.",
]

interface AnalysisInputProps {
  onSubmit: (input: string) => void
  isRunning: boolean
  remaining: number
  isTokenHolder: boolean
}

export function AnalysisInput({ onSubmit, isRunning, remaining, isTokenHolder }: AnalysisInputProps) {
  const [value, setValue] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed || isRunning || remaining === 0) return
    onSubmit(trimmed)
  }

  function loadExample(ex: string) {
    setValue(ex)
  }

  const canSubmit = value.trim().length > 20 && !isRunning && remaining > 0

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Paste your decision, investment thesis, DAO proposal, or on-chain strategy…"
          rows={6}
          className="w-full bg-[#0c0a10] border border-white/10 rounded-lg px-4 py-3 font-body text-sm text-white/80 placeholder-white/20 resize-none focus:outline-none focus:border-amber-500/50 focus:shadow-[0_0_20px_rgba(232,114,10,0.06)] transition-all"
          disabled={isRunning}
        />
        <div className="absolute bottom-3 right-3 font-mono text-[10px] text-white/20">
          {value.length} chars
        </div>
      </div>

      {/* Examples */}
      <div className="space-y-2">
        <p className="font-mono text-[10px] uppercase tracking-wider text-white/20">
          Load an example
        </p>
        <div className="flex flex-col gap-1.5">
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              type="button"
              onClick={() => loadExample(ex)}
              className="text-left font-body text-xs text-white/30 hover:text-white/60 truncate transition-colors"
            >
              → {ex.slice(0, 80)}…
            </button>
          ))}
        </div>
      </div>

      {/* Submit row */}
      <div className="flex items-center justify-between">
        <div className="font-mono text-[10px] text-white/30">
          {isTokenHolder ? (
            <span className="text-amber-400">Unlimited runs · Token Holder</span>
          ) : (
            <span>
              {remaining} / 3 free runs remaining today
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className={`font-mono text-xs px-6 py-2.5 rounded transition-all ${
            canSubmit
              ? "bg-amber-500 text-black hover:bg-amber-400 font-bold"
              : "bg-white/5 text-white/20 cursor-not-allowed"
          }`}
        >
          {isRunning ? "Running…" : remaining === 0 ? "Limit reached" : "Run Crucible →"}
        </button>
      </div>
    </form>
  )
}
