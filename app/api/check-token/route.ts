import { getCrucibleTokenBalance, isTokenHolder } from "@/lib/solana"

export async function POST(req: Request) {
  try {
    const { walletAddress } = await req.json()

    if (!walletAddress || typeof walletAddress !== "string") {
      return Response.json({ error: "walletAddress required." }, { status: 400 })
    }

    const [balance, holder] = await Promise.all([
      getCrucibleTokenBalance(walletAddress),
      isTokenHolder(walletAddress),
    ])

    return Response.json({ balance, isHolder: holder })
  } catch (err) {
    console.error("[check-token]", err)
    return Response.json({ error: "Internal error." }, { status: 500 })
  }
}
