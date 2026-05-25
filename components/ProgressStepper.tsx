"use client"

import { AGENTS } from "@/lib/agents"
import type { AgentState } from "@/types"

interface ProgressStepperProps {
  agentStates: AgentState[]
}

export function ProgressStepper({ agentStates }: ProgressStepperProps) {
  return (
    <div className="flex items-center gap-0 w-full max-w-2xl mx-auto">
      {AGENTS.map((agent, i) => {
        const state = agentStates.find((s) => s.id === agent.id)
        const status = state?.status ?? "idle"

        return (
          <div key={agent.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1.5 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all duration-500 ${
                  status === "done"
                    ? "bg-amber-500 text-black"
                    : status === "running"
                    ? "bg-amber-500/30 text-amber-400 ring-2 ring-amber-500 ring-offset-1 ring-offset-[#070609] animate-pulse"
                    : status === "error"
                    ? "bg-red-500/20 text-red-400 ring-1 ring-red-500"
                    : "bg-white/5 text-white/20 ring-1 ring-white/10"
                }`}
              >
                {agent.num}
              </div>
              <span
                className={`font-mono text-[10px] uppercase tracking-wider text-center leading-tight transition-colors ${
                  status === "done"
                    ? "text-amber-400"
                    : status === "running"
                    ? "text-white/80"
                    : "text-white/20"
                }`}
              >
                {agent.name}
              </span>
            </div>
            {i < AGENTS.length - 1 && (
              <div
                className={`h-px flex-1 transition-colors duration-700 ${
                  agentStates[i]?.status === "done" ? "bg-amber-500/40" : "bg-white/10"
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
