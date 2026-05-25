"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Logo } from "@/components/Logo"
import { WalletButton } from "@/components/WalletButton"

const NAV_LINKS = [
  { href: "/app", label: "Run Analysis" },
  { href: "/token", label: "Token" },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#070609]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Logo size="sm" />

        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-mono text-xs uppercase tracking-wider transition-colors ${
                pathname === link.href
                  ? "text-amber-400"
                  : "text-white/40 hover:text-white/80"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <WalletButton />
      </div>
    </header>
  )
}
