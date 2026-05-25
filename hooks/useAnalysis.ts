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
        // Show all 4 agents activating sequentially while API runs (~12s per agent)
        setAgentStatus(AGENTS[0].id as AgentId, { status: "running" })
        const agentTimings = [0, 11000, 22000, 34000]
        const timers: ReturnType<typeof setTimeout>[] = []
        for (let i = 1; i < AGENTS.length; i++) {
          const timer = setTimeout(() => {
            setAgentStatus(AGENTS[i].id as AgentId, { status: "running" })
          }, agentTimings[i])
          timers.push(timer)
        }

        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input, walletAddress }),
        })

        // Clear the simulated timers once real data arrives
        timers.forEach(clearTimeout)

        if (res.status === 429) {
          const { error: msg } = await res.json()
          setError(msg)
          return
        }

        if (!res.ok) {
          setError("Analysis failed. Please try again.")
          return
        }

        const data = await res.json()

        // Reveal real results one by one
        for (let i = 0; i < AGENTS.length; i++) {
          setAgentStatus(AGENTS[i].id as AgentId, { status: "running" })
          await new Promise((r) => setTimeout(r, 300))
          setAgentStatus(AGENTS[i].id as AgentId, {
            status: "done",
            output: data.results[AGENTS[i].id] || "",
          })
          if (i < AGENTS.length - 1) await new Promise((r) => setTimeout(r, 400))
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
