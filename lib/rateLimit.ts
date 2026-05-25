import { createServiceClient } from "@/lib/supabase"
import { isTokenHolder } from "@/lib/solana"

const FREE_DAILY_LIMIT = 3
const TOKEN_DAILY_LIMIT = 999

const supabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== "your_supabase_project_url_here"

export async function checkRateLimit(
  identifier: string,
  walletAddress?: string
): Promise<{ allowed: boolean; isTokenHolder: boolean; remaining: number }> {
  const holderStatus = walletAddress ? await isTokenHolder(walletAddress) : false

  // Supabase not yet configured — allow all requests (dev/demo mode)
  if (!supabaseConfigured) {
    return { allowed: true, isTokenHolder: holderStatus, remaining: FREE_DAILY_LIMIT }
  }

  const dailyLimit = holderStatus ? TOKEN_DAILY_LIMIT : FREE_DAILY_LIMIT
  const supabase = createServiceClient()
  const today = new Date().toISOString().split("T")[0]

  try {
    const { data } = await supabase
      .from("usage")
      .select("count")
      .eq("identifier", identifier)
      .eq("date", today)
      .single()

    const currentCount = data?.count || 0

    if (currentCount >= dailyLimit) {
      return { allowed: false, isTokenHolder: holderStatus, remaining: 0 }
    }

    await supabase.from("usage").upsert({
      identifier,
      date: today,
      count: currentCount + 1,
    })

    return {
      allowed: true,
      isTokenHolder: holderStatus,
      remaining: dailyLimit - currentCount - 1,
    }
  } catch {
    // DB error — fail open so users aren't blocked
    return { allowed: true, isTokenHolder: holderStatus, remaining: FREE_DAILY_LIMIT }
  }
}
