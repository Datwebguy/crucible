"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"

export function useTokenBalance() {
  const { publicKey, connected } = useWallet()
  const [isHolder, setIsHolder] = useState(false)
  const [balance, setBalance] = useState<number>(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!connected || !publicKey) {
      setIsHolder(false)
      setBalance(0)
      return
    }

    let cancelled = false

    async function check() {
      setLoading(true)
      try {
        const res = await fetch("/api/check-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ walletAddress: publicKey!.toString() }),
        })
        if (!res.ok) return
        const data = await res.json()
        if (!cancelled) {
          setIsHolder(data.isHolder)
          setBalance(data.balance)
        }
      } catch {
        // silently fail — non-critical
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    check()
    return () => { cancelled = true }
  }, [connected, publicKey])

  return { isHolder, balance, loading }
}
