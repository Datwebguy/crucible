import { createServiceClient } from "@/lib/supabase"
import { isTokenHolder as checkIsTokenHolder } from "@/lib/solana"

export async function POST(req: Request) {
  try {
    const { input, results, reasoningScore, walletAddress } = await req.json()

    if (!walletAddress) {
      return Response.json({ error: "Wallet required to save analyses." }, { status: 401 })
    }

    const holder = await checkIsTokenHolder(walletAddress)
    if (!holder) {
      return Response.json({ error: "Token holder access required." }, { status: 403 })
    }

    const supabase = createServiceClient()

    const { data, error } = await supabase
      .from("analyses")
      .insert({
        wallet_address: walletAddress,
        input,
        bias_output: results.bias,
        bear_output: results.bear,
        assumption_output: results.assumption,
        audit_output: results.audit,
        reasoning_score: reasoningScore,
        is_public: false,
      })
      .select("id")
      .single()

    if (error) {
      console.error("[save-analysis]", error)
      return Response.json({ error: "Failed to save." }, { status: 500 })
    }

    return Response.json({ id: data.id })
  } catch (err) {
    console.error("[save-analysis]", err)
    return Response.json({ error: "Internal error." }, { status: 500 })
  }
}
