import Anthropic from "@anthropic-ai/sdk"
import { AGENTS } from "@/lib/agents"
import { checkRateLimit } from "@/lib/rateLimit"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

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
      const content =
        agent.id === "audit"
          ? `Original decision:\n"${input}"\n\nAgent I (Bias Hunter):\n${results.bias}\n\nAgent II (Bear Case Builder):\n${results.bear}\n\nAgent III (Assumption Extractor):\n${results.assumption}`
          : input

      const response = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 1200,
        system: agent.prompt,
        messages: [{ role: "user", content }],
      })

      const raw = response.content[0].type === "text" ? response.content[0].text : ""
      // Strip any markdown that slips through despite prompt instructions
      results[agent.id] = raw
        .replace(/\*\*(.+?)\*\*/g, "$1")   // **bold**
        .replace(/\*(.+?)\*/g, "$1")         // *italic*
        .replace(/^[\s]*[-•]\s/gm, "")       // leading hyphens/bullets
        .replace(/_{2}(.+?)_{2}/g, "$1")     // __bold__
        .trim()
    }

    const scoreMatch = results.audit?.match(/REASONING SCORE:\s*(\d+)\/100/)
    const reasoningScore = scoreMatch ? parseInt(scoreMatch[1]) : null

    return Response.json({ results, reasoningScore, remaining, isTokenHolder })
  } catch (err) {
    console.error("[analyze]", err)
    return Response.json({ error: "Analysis failed. Please try again." }, { status: 500 })
  }
}
