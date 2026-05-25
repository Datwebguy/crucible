import { createServiceClient } from "@/lib/supabase"
import { isTokenHolder } from "@/lib/solana"

export async function POST(req: Request) {
  try {
    const { walletAddress } = await req.json()

    if (!walletAddress) {
      return Response.json({ error: "walletAddress required." }, { status: 400 })
    }

    const holder = await isTokenHolder(walletAddress)
    if (!holder) {
      return Response.json({ error: "Token holder access required." }, { status: 403 })
    }

    const supabase = createServiceClient()

    const { data, error } = await supabase
      .from("analyses")
      .select("id, created_at, input, bias_output, bear_output, assumption_output, audit_output, reasoning_score, wallet_address")
      .eq("wallet_address", walletAddress)
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) {
      console.error("[history]", error)
      return Response.json({ error: "Failed to fetch." }, { status: 500 })
    }

    const analyses = (data || []).map((row) => ({
      id: row.id,
      input: row.input,
      results: {
        bias: row.bias_output || "",
        bear: row.bear_output || "",
        assumption: row.assumption_output || "",
        audit: row.audit_output || "",
      },
      reasoningScore: row.reasoning_score,
      createdAt: row.created_at,
      walletAddress: row.wallet_address,
    }))

    return Response.json({ analyses })
  } catch (err) {
    console.error("[history]", err)
    return Response.json({ error: "Internal error." }, { status: 500 })
  }
}
