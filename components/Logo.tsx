"use client"

import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  size?: "sm" | "md" | "lg"
}

export function Logo({ size = "md" }: LogoProps) {
  const dims = { sm: 28, md: 36, lg: 56 }[size]
  const textSize = { sm: "text-sm", md: "text-base", lg: "text-2xl" }[size]

  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      <Image
        src="/icon.svg"
        alt="Crucible"
        width={dims}
        height={dims}
        className="shrink-0"
        priority
      />
      <span
        className={`font-heading font-bold tracking-widest text-white uppercase ${textSize} group-hover:text-amber-400 transition-colors`}
      >
        Crucible
      </span>
    </Link>
  )
}
