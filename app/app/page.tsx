"use client"

import { useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Navbar } from "@/components/Navbar"
import { AnalysisInput } from "@/components/AnalysisInput"
import { ProgressStepper } from "@/components/ProgressStepper"
import { AgentCard } from "@/components/AgentCard"
import { FlowCanvas } from "@/components/FlowCanvas"
import { useAnalysis } from "@/hooks/useAnalysis"
import { useTokenBalance } from "@/hooks/useTokenBalance"
import { useRateLimit } from "@/hooks/useRateLimit"
import { AGENTS } from "@/lib/agents"

export default function AppPage() {
  const { publicKey } = useWallet()
  const walletAddress = publicKey?.toString()
  const { isHolder } = useTokenBalance()
  const { remaining, recordUsage } = useRateLimit(isHolder)
  const { agentStates, result, isRunning, error, run, reset } = useAnalysis(walletAddress)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")

  async function handleSubmit(input: string) {
    recordUsage()
    await run(input)
  }

  async function handleSave() {
    if (!result || !walletAddress) return
    setSaveStatus("saving")
    try {
      const res = await fetch("/api/save-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: result.input,
          results: result.results,
          reasoningScore: result.reasoningScore,
          walletAddress,
        }),
      })
      setSaveStatus(res.ok ? "saved" : "error")
    } catch {
      setSaveStatus("error")
    }
  }

  const hasStarted = agentStates.some((s) => s.status !== "idle")

  return (
    <div className="relative min-h-screen bg-[#070609] text-white overflow-hidden">
      <FlowCanvas />
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 pt-24 pb-20">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-heading text-2xl font-bold mb-1">Run an Analysis</h1>
          <p className="font-body text-sm text-white/40">
            Paste your decision or thesis below. Four agents will audit it.
          </p>
        </div>

        {/* Input (hidden when running/done) */}
        {!hasStarted && (
          <AnalysisInput
            onSubmit={handleSubmit}
            isRunning={isRunning}
            remaining={remaining}
            isTokenHolder={isHolder}
          />
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 p-4 rounded-lg border border-red-500/20 bg-red-500/5">
            <p className="font-mono text-xs text-red-400">{error}</p>
            <button
              onClick={reset}
              className="mt-2 font-mono text-xs text-white/40 hover:text-white/70 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Progress stepper */}
        {hasStarted && (
          <div className="mb-8">
            <ProgressStepper agentStates={agentStates} />
          </div>
        )}

        {/* Agent output cards */}
        {hasStarted && (
          <div className="space-y-4">
            {AGENTS.map((agent) => {
              const state = agentStates.find((s) => s.id === agent.id)!
              if (state.status === "idle") return null
              return <AgentCard key={agent.id} agentState={state} />
            })}
          </div>
        )}

        {/* Result footer */}
        {result && (
          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-white/[0.06]">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold text-amber-400">
                {result.reasoningScore ?? "—"}
              </span>
              <span className="font-mono text-sm text-white/30">/100 reasoning score</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={reset}
                className="font-mono text-xs px-4 py-2 rounded border border-white/15 text-white/40 hover:text-white/70 hover:border-white/30 transition-colors"
              >
                New Analysis
              </button>

              {isHolder && walletAddress && (
                <button
                  onClick={handleSave}
                  disabled={saveStatus !== "idle"}
                  className={`font-mono text-xs px-4 py-2 rounded transition-all ${
                    saveStatus === "saved"
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : saveStatus === "error"
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : "bg-amber-500 text-black font-bold hover:bg-amber-400"
                  }`}
                >
                  {saveStatus === "saving"
                    ? "Saving…"
                    : saveStatus === "saved"
                    ? "Saved ✓"
                    : saveStatus === "error"
                    ? "Failed"
                    : "Save Analysis"}
                </button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
