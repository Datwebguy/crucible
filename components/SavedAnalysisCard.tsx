"use client"

import { useState } from "react"
import type { AnalysisResult } from "@/types"
import { AGENTS } from "@/lib/agents"
import { AgentCard } from "@/components/AgentCard"

interface SavedAnalysisCardProps {
  analysis: AnalysisResult & { id: string; createdAt: string }
}

export function SavedAnalysisCard({ analysis }: SavedAnalysisCardProps) {
  const [expanded, setExpanded] = useState(false)

  const date = new Date(analysis.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  const score = analysis.reasoningScore

  return (
    <div className="rounded-lg border border-white/[0.06] bg-[#0c0a10] overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex-1 min-w-0">
          <p className="font-body text-sm text-white/70 truncate">{analysis.input}</p>
          <p className="font-mono text-[10px] text-white/30 mt-0.5">{date}</p>
        </div>

        <div className="flex items-center gap-3 ml-4 shrink-0">
          {score !== null && (
            <div className="flex items-center gap-1">
              <span className="font-mono text-xs font-bold text-amber-400">{score}</span>
              <span className="font-mono text-[10px] text-white/30">/100</span>
            </div>
          )}
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className={`text-white/30 transition-transform ${expanded ? "rotate-180" : ""}`}
          >
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-white/[0.06] px-4 py-4 space-y-3">
          <p className="font-body text-xs text-white/50 leading-relaxed">{analysis.input}</p>
          <div className="space-y-3">
            {AGENTS.map((agent) => (
              <AgentCard
                key={agent.id}
                agentState={{
                  id: agent.id,
                  status: "done",
                  output: analysis.results[agent.id] || "",
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
