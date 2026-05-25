"use client"

import { useState, useCallback } from "react"
import type { AgentId, AgentState, AnalysisResult } from "@/types"
import { AGENTS } from "@/lib/agents"

const initialAgentStates = (): AgentState[] =>
  AGENTS.map((a) => ({ id: a.id as AgentId, status: "idle", output: "" }))

export function useAnalysis(walletAddress?: string) {
  const [agentStates, setAgentStates] = useState<AgentState[]>(initialAgentStates())
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const setAgentStatus = useCallback(
    (id: AgentId, patch: Partial<AgentState>) => {
      setAgentStates((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...patch } : s))
      )
    },
    []
  )

  const run = useCallback(
    async (input: string) => {
      setIsRunning(true)
      setError(null)
      setResult(null)
      setAgentStates(initialAgentStates())

      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input, walletAddress }),
        })

        if (res.status === 429) {
          const { error: msg } = await res.json()
          setError(msg)
          return
        }

        if (!res.ok) {
          setError("Analysis failed. Please try again.")
          return
        }

        // Show agents activating sequentially for better UX
        setAgentStatus(AGENTS[0].id as AgentId, { status: "running" })

        const data = await res.json()

        // Reveal results one by one with short delays
        for (let i = 0; i < AGENTS.length; i++) {
          const agent = AGENTS[i]
          if (i > 0) {
            setAgentStatus(AGENTS[i].id as AgentId, { status: "running" })
            await new Promise((r) => setTimeout(r, 400))
          }
          setAgentStatus(agent.id as AgentId, {
            status: "done",
            output: data.results[agent.id] || "",
          })
          if (i < AGENTS.length - 1) await new Promise((r) => setTimeout(r, 300))
        }

        setResult({
          input,
          results: data.results,
          reasoningScore: data.reasoningScore,
          walletAddress,
        })
      } catch {
        setError("Network error. Please try again.")
        setAgentStates((prev) =>
          prev.map((s) => (s.status === "running" ? { ...s, status: "error" } : s))
        )
      } finally {
        setIsRunning(false)
      }
    },
    [walletAddress, setAgentStatus]
  )

  const reset = useCallback(() => {
    setAgentStates(initialAgentStates())
    setResult(null)
    setError(null)
    setIsRunning(false)
  }, [])

  return { agentStates, result, isRunning, error, run, reset }
}
