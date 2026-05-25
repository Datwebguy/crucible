export type AgentId = "bias" | "bear" | "assumption" | "audit"
export type AgentStatus = "idle" | "running" | "done" | "error"

export interface Agent {
  id: AgentId
  num: string
  name: string
  verb: string
  color: string
  prompt: string
}

export interface AnalysisResult {
  id?: string
  input: string
  results: Record<AgentId, string>
  reasoningScore: number | null
  createdAt?: string
  walletAddress?: string
}

export interface UsageStatus {
  allowed: boolean
  isTokenHolder: boolean
  remaining: number
}

export interface AgentState {
  id: AgentId
  status: AgentStatus
  output: string
}
