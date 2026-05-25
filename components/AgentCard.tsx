"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AGENTS } from "@/lib/agents"
import type { AgentState } from "@/types"

interface AgentCardProps {
  agentState: AgentState
}

function isHeader(line: string): boolean {
  const trimmed = line.trim()
  if (!trimmed) return false
  // ALL CAPS section label (e.g. BEAR THESIS, REASONING SCORE: 45/100)
  if (/^[A-Z][A-Z0-9\s:\/\.]+$/.test(trimmed) && trimmed.length > 2) return true
  // Numbered list item (e.g. "1.", "2.", "3.")
  if (/^\d+\.$/.test(trimmed)) return true
  return false
}

function isNumberedItem(line: string): boolean {
  return /^\d+\./.test(line.trim()) && line.trim().length > 3
}

function renderOutput(text: string, color: string) {
  const lines = text.split("\n")
  const elements: React.ReactNode[] = []
  let key = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    if (!trimmed) {
      elements.push(<div key={key++} className="h-2" />)
      continue
    }

    if (isHeader(trimmed)) {
      elements.push(
        <p
          key={key++}
          className="font-mono text-[11px] font-bold tracking-wider mt-4 first:mt-0"
          style={{ color }}
        >
          {trimmed}
        </p>
      )
    } else if (isNumberedItem(trimmed)) {
      const numEnd = trimmed.indexOf(".") + 1
      const num = trimmed.slice(0, numEnd)
      const rest = trimmed.slice(numEnd).trim()
      elements.push(
        <div key={key++} className="flex gap-2 mt-1">
          <span className="font-mono text-[11px] font-bold shrink-0 mt-0.5" style={{ color }}>
            {num}
          </span>
          <p className="font-body text-sm text-white/75 leading-relaxed">{rest}</p>
        </div>
      )
    } else {
      elements.push(
        <p key={key++} className="font-body text-sm text-white/75 leading-relaxed">
          {trimmed}
        </p>
      )
    }
  }

  return elements
}

export function AgentCard({ agentState }: AgentCardProps) {
  const agent = AGENTS.find((a) => a.id === agentState.id)!
  const { status, output } = agentState

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`rounded-lg border bg-[#0c0a10] overflow-hidden transition-all duration-300 ${
        status === "running"
          ? "border-amber-500/40 shadow-[0_0_20px_rgba(232,114,10,0.08)]"
          : status === "done"
          ? "border-white/10"
          : "border-white/[0.04]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <span
            className="font-mono text-xs font-bold px-2 py-0.5 rounded"
            style={{ color: agent.color, backgroundColor: `${agent.color}18` }}
          >
            {agent.num}
          </span>
          <span className="font-heading font-semibold text-sm text-white">
            {agent.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {status === "running" && (
            <span className="font-mono text-[10px] text-amber-400/70 animate-pulse">
              {agent.verb}…
            </span>
          )}
          {status === "done" && (
            <span className="font-mono text-[10px] text-white/30">COMPLETE</span>
          )}
          <div
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              status === "done"
                ? "bg-green-400"
                : status === "running"
                ? "bg-amber-400 animate-pulse"
                : status === "error"
                ? "bg-red-400"
                : "bg-white/10"
            }`}
          />
        </div>
      </div>

      {/* Body */}
      <AnimatePresence>
        {status === "running" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-4 py-6 flex items-center gap-3"
          >
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1 h-4 rounded-full bg-amber-500/40 animate-pulse"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
            <span className="font-mono text-xs text-white/30">Processing…</span>
          </motion.div>
        )}

        {status === "done" && output && (
          <motion.div
            key="output"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="px-4 py-4 space-y-1"
          >
            {renderOutput(output, agent.color)}
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-4 py-4"
          >
            <p className="font-mono text-xs text-red-400">Agent error. Please retry.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
