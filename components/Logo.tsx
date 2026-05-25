"use client"

import Link from "next/link"

interface LogoProps {
  size?: "sm" | "md" | "lg"
}

export function Logo({ size = "md" }: LogoProps) {
  const dims = { sm: 24, md: 32, lg: 48 }[size]
  const textSize = { sm: "text-sm", md: "text-base", lg: "text-2xl" }[size]

  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      <svg
        width={dims}
        height={dims}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <polygon
          points="24,2 44,13 44,35 24,46 4,35 4,13"
          fill="none"
          stroke="#E8720A"
          strokeWidth="2"
        />
        <polygon
          points="24,10 36,17 36,31 24,38 12,31 12,17"
          fill="#E8720A"
          fillOpacity="0.15"
          stroke="#E8720A"
          strokeWidth="1"
          strokeOpacity="0.5"
        />
        <line x1="24" y1="2" x2="24" y2="10" stroke="#E8720A" strokeWidth="1.5" strokeOpacity="0.6" />
        <line x1="44" y1="13" x2="36" y2="17" stroke="#E8720A" strokeWidth="1.5" strokeOpacity="0.6" />
        <line x1="44" y1="35" x2="36" y2="31" stroke="#E8720A" strokeWidth="1.5" strokeOpacity="0.6" />
        <line x1="24" y1="46" x2="24" y2="38" stroke="#E8720A" strokeWidth="1.5" strokeOpacity="0.6" />
        <line x1="4" y1="35" x2="12" y2="31" stroke="#E8720A" strokeWidth="1.5" strokeOpacity="0.6" />
        <line x1="4" y1="13" x2="12" y2="17" stroke="#E8720A" strokeWidth="1.5" strokeOpacity="0.6" />
        <circle cx="24" cy="24" r="3" fill="#E8720A" />
      </svg>
      <span
        className={`font-heading font-bold tracking-widest text-white uppercase ${textSize} group-hover:text-amber-400 transition-colors`}
      >
        Crucible
      </span>
    </Link>
  )
}
