import { Connection, PublicKey } from "@solana/web3.js"
import { getAssociatedTokenAddress, getAccount } from "@solana/spl-token"

const connection = new Connection(
  process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.mainnet-beta.solana.com"
)

const MINIMUM_HOLD = parseInt(
  process.env.CRUCIBLE_TOKEN_MINIMUM_HOLD || "1000"
)

function getTokenMint(): PublicKey | null {
  const mint = process.env.NEXT_PUBLIC_CRUCIBLE_TOKEN_MINT
  if (!mint) return null
  try {
    return new PublicKey(mint)
  } catch {
    return null
  }
}

export async function getCrucibleTokenBalance(walletAddress: string): Promise<number> {
  try {
    const TOKEN_MINT = getTokenMint()
    if (!TOKEN_MINT) return 0

    const wallet = new PublicKey(walletAddress)
    const ata = await getAssociatedTokenAddress(TOKEN_MINT, wallet)
    const account = await getAccount(connection, ata)
    return Number(account.amount)
  } catch {
    return 0
  }
}

export async function isTokenHolder(walletAddress: string): Promise<boolean> {
  const balance = await getCrucibleTokenBalance(walletAddress)
  return balance >= MINIMUM_HOLD
}
