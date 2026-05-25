import { AGENTS } from "@/lib/agents"
import { checkRateLimit } from "@/lib/rateLimit"

const SWARMS_API_URL = "https://api.swarms.world/v1/agent/completions"

async function runSwarmAgent(
  agentName: string,
  systemPrompt: string,
  task: string
): Promise<string> {
  const res = await fetch(SWARMS_API_URL, {
    method: "POST",
    headers: {
      "x-api-key": process.env.SWARMS_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      agent_config: {
        agent_name: agentName,
        description: `Crucible agent: ${agentName}`,
        system_prompt: systemPrompt,
        model_name: "gpt-4o",
        max_tokens: 1200,
        temperature: 0.5,
        max_loops: 1,
      },
      task,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    console.error(`[swarms] ${res.status} for agent "${agentName}":`, body)
    throw new Error(`Swarms API error ${res.status}: ${body}`)
  }

  const data = await res.json()
  console.log(`[swarms] raw response for "${agentName}":`, JSON.stringify(data).slice(0, 500))

  // Extract text from possible response shapes
  const raw: string =
    data.output ??
    data.outputs?.[0]?.content ??
    data.outputs?.[0] ??
    data.choices?.[0]?.message?.content ??
    data.result ??
    JSON.stringify(data)

  // Strip any markdown that slips through despite prompt instructions
  return String(raw)
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/^[\s]*[-•]\s/gm, "")
    .replace(/_{2}(.+?)_{2}/g, "$1")
    .trim()
}

export async function POST(req: Request) {
  try {
    const { input, walletAddress } = await req.json()

    if (!input || typeof input !== "string" || input.trim().length < 10) {
      return Response.json({ error: "Input too short." }, { status: 400 })
    }

    const forwarded = req.headers.get("x-forwarded-for")
    const identifier = walletAddress || forwarded?.split(",")[0]?.trim() || "anonymous"

    const { allowed, isTokenHolder, remaining } = await checkRateLimit(identifier, walletAddress)

    if (!allowed) {
      return Response.json(
        { error: "Daily limit reached. Hold CRUCIBLE tokens for unlimited access." },
        { status: 429 }
      )
    }

    const results: Record<string, string> = {}

    for (const agent of AGENTS) {
      const task =
        agent.id === "audit"
          ? `Original decision:\n"${input}"\n\nAgent I (Bias Hunter):\n${results.bias}\n\nAgent II (Bear Case Builder):\n${results.bear}\n\nAgent III (Assumption Extractor):\n${results.assumption}`
          : input

      results[agent.id] = await runSwarmAgent(agent.name, agent.prompt, task)
    }

    const scoreMatch = results.audit?.match(/REASONING SCORE:\s*(\d+)\/100/)
    const reasoningScore = scoreMatch ? parseInt(scoreMatch[1]) : null

    return Response.json({ results, reasoningScore, remaining, isTokenHolder })
  } catch (err) {
    console.error("[analyze]", err)
    return Response.json({ error: "Analysis failed. Please try again." }, { status: 500 })
  }
}
