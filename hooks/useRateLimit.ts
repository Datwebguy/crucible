"use client"

import { useState, useEffect } from "react"

const STORAGE_KEY = "crucible_usage"
const FREE_DAILY_LIMIT = 3

interface DailyUsage {
  date: string
  count: number
}

export function useRateLimit(isTokenHolder: boolean) {
  const [remaining, setRemaining] = useState<number>(FREE_DAILY_LIMIT)

  useEffect(() => {
    if (isTokenHolder) {
      setRemaining(999)
      return
    }

    const today = new Date().toISOString().split("T")[0]
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const usage: DailyUsage = JSON.parse(stored)
        if (usage.date === today) {
          setRemaining(Math.max(0, FREE_DAILY_LIMIT - usage.count))
          return
        }
      }
    } catch {
      // ignore parse errors
    }
    setRemaining(FREE_DAILY_LIMIT)
  }, [isTokenHolder])

  function recordUsage() {
    if (isTokenHolder) return
    const today = new Date().toISOString().split("T")[0]
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      let count = 1
      if (stored) {
        const usage: DailyUsage = JSON.parse(stored)
        count = usage.date === today ? usage.count + 1 : 1
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, count }))
      setRemaining(Math.max(0, FREE_DAILY_LIMIT - count))
    } catch {
      // ignore
    }
  }

  return { remaining, recordUsage }
}
