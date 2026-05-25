import Link from "next/link"
import { FlowCanvas } from "@/components/FlowCanvas"
import { Logo } from "@/components/Logo"
import { AGENTS } from "@/lib/agents"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#070609] text-white">
      {/* Minimal nav */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 h-14 flex items-center justify-between border-b border-white/[0.06] bg-[#070609]/80 backdrop-blur-md">
        <Logo size="sm" />
        <nav className="flex items-center gap-6">
          <Link href="/token" className="font-mono text-xs uppercase tracking-wider text-white/40 hover:text-white/80 transition-colors">
            Token
          </Link>
          <Link
            href="/app"
            className="font-mono text-xs px-4 py-2 rounded bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors"
          >
            Run Crucible
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-14 overflow-hidden">
        <FlowCanvas />
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-block font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400/80 border border-amber-500/20 px-3 py-1 rounded-full mb-8">
            Decision Intelligence for Web3
          </div>
          <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
            Your reasoning,
            <br />
            <span className="text-amber-400">tested to its core.</span>
          </h1>
          <p className="font-body text-lg text-white/50 max-w-xl mx-auto mb-10 leading-relaxed">
            Four AI agents dissect your thesis — hunting bias, building the bear case, surfacing assumptions, and issuing a final verdict before you commit.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/app"
              className="font-mono text-sm px-8 py-3.5 rounded bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors"
            >
              Run Crucible →
            </Link>
            <Link
              href="/token"
              className="font-mono text-sm px-8 py-3.5 rounded border border-white/15 text-white/60 hover:text-white hover:border-white/30 transition-colors"
            >
              Get Token Access
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <div className="w-px h-8 bg-white/20 animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">Scroll</span>
        </div>
      </section>

      {/* Four Agents */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400/60 mb-3">The System</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold">Four agents. One verdict.</h2>
          <p className="font-body text-white/40 mt-4 max-w-lg mx-auto">
            Each agent runs sequentially, each building on the last, culminating in a final reasoning score.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {AGENTS.map((agent) => (
            <div
              key={agent.id}
              className="rounded-lg border border-white/[0.06] bg-[#0c0a10] p-6 hover:border-white/10 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="font-mono text-xs font-bold w-7 h-7 rounded flex items-center justify-center"
                  style={{ color: agent.color, backgroundColor: `${agent.color}18` }}
                >
                  {agent.num}
                </span>
                <h3 className="font-heading font-semibold text-white">{agent.name}</h3>
              </div>
              <p className="font-mono text-xs text-white/30 italic">{agent.verb}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-4xl mx-auto px-6 py-16 border-t border-white/[0.04]">
        <div className="text-center mb-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400/60 mb-3">Process</p>
          <h2 className="font-heading text-3xl font-bold">How It Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: "01", title: "Paste Your Decision", body: "Drop in any investment thesis, DAO proposal, or on-chain strategy. The longer and more detailed, the sharper the audit." },
            { step: "02", title: "Four Agents Analyze", body: "Bias Hunter, Bear Case Builder, Assumption Extractor, and Reasoning Auditor run in sequence — each feeding context to the next." },
            { step: "03", title: "Get Your Verdict", body: "Receive a Reasoning Score out of 100, ranked risks, a corrected position, and three questions to answer before committing." },
          ].map((item) => (
            <div key={item.step} className="space-y-3">
              <div className="font-mono text-2xl font-bold text-amber-500/20">{item.step}</div>
              <h3 className="font-heading font-semibold text-white">{item.title}</h3>
              <p className="font-body text-sm text-white/40 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Token Tier */}
      <section className="max-w-4xl mx-auto px-6 py-16 border-t border-white/[0.04]">
        <div className="text-center mb-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400/60 mb-3">Access</p>
          <h2 className="font-heading text-3xl font-bold">Free vs. Token Holder</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-white/[0.06] bg-[#0c0a10] p-6">
            <h3 className="font-heading font-bold text-lg mb-4 text-white/60">Free Tier</h3>
            <ul className="space-y-2">
              {["3 analyses per day", "Standard agent depth", "No history saved", "No sharing"].map((item) => (
                <li key={item} className="flex items-center gap-2 font-body text-sm text-white/40">
                  <span className="text-white/20">—</span> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-amber-500/25 bg-amber-500/[0.03] p-6">
            <h3 className="font-heading font-bold text-lg mb-4 text-amber-400">CRUCIBLE Holder</h3>
            <ul className="space-y-2">
              {["Unlimited analyses", "Extended agent depth", "Full history + search", "Share analyses publicly", "Early access to new agents", "Governance votes"].map((item) => (
                <li key={item} className="flex items-center gap-2 font-body text-sm text-white/70">
                  <span className="text-amber-500">✓</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/token"
            className="font-mono text-xs px-6 py-2.5 rounded border border-amber-500/40 text-amber-400 hover:bg-amber-500/10 transition-all"
          >
            Get CRUCIBLE Tokens →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] px-6 py-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <p className="font-mono text-[10px] text-white/20">
            Built for Web3 · Powered by Anthropic · Token on Solana
          </p>
          <div className="flex gap-4">
            <Link href="/app" className="font-mono text-[10px] text-white/30 hover:text-white/60">App</Link>
            <Link href="/token" className="font-mono text-[10px] text-white/30 hover:text-white/60">Token</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
