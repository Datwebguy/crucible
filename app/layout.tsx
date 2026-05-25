import type { Metadata } from "next"
import { Bricolage_Grotesque, DM_Sans, IBM_Plex_Mono } from "next/font/google"
import "./globals.css"
import { WalletProviders } from "@/components/WalletProviders"

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
})

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Crucible — Web3 Decision Intelligence",
  description:
    "Four AI agents audit your investment thesis, DAO proposal, or on-chain strategy — hunting bias, building the bear case, surfacing assumptions, and issuing a final verdict.",
  keywords: ["web3", "decision intelligence", "AI", "DeFi", "Solana", "bias detection"],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${bricolage.variable} ${dmSans.variable} ${ibmPlexMono.variable} h-full`}
    >
      <body className="min-h-full bg-[#070609]">
        <WalletProviders>{children}</WalletProviders>
      </body>
    </html>
  )
}
