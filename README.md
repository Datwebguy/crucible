# Crucible

**Web3 Decision Intelligence Engine**

Crucible runs your investment thesis, DAO proposal, or on-chain strategy through four sequential AI agents — each one stress-testing a different dimension of your reasoning. The result is a structured audit with a Reasoning Score out of 100 and a final verdict before you commit.

Built with Anthropic Claude, deployed on Solana, listed on the Swarms Marketplace.

---

## The Four Agents

| # | Agent | What it does |
|---|-------|--------------|
| I | Bias Hunter | Identifies every cognitive bias corrupting the reasoning — FOMO, narrative capture, CT groupthink, recency bias, confirmation bias, and more |
| II | Bear Case Builder | Constructs the strongest, most technically grounded opposition a serious on-chain analyst would make |
| III | Assumption Extractor | Surfaces every hidden assumption baked into the position — liquidity, team, tokenomics, cycle timing — and rates each FATAL / HIGH / MEDIUM / LOW |
| IV | Reasoning Auditor | Synthesises all three agents into a final report: Reasoning Score, top risks, corrected position, three questions to answer before committing, and a final verdict |

---

## Access Tiers

| Feature | Free | CRUCIBLE Holder |
|---------|------|-----------------|
| Daily analyses | 3 | Unlimited |
| Agent depth | Standard | Extended |
| Save analyses | No | Yes |
| Analysis history | No | Yes |
| Share analyses | No | Yes (public link) |
| Early agent access | No | Yes |
| Governance votes | No | Yes |

Holding 1,000+ CRUCIBLE tokens (Solana SPL) unlocks the token holder tier automatically when you connect your wallet.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 |
| AI | Anthropic API — claude-sonnet-4-6 |
| Database | Supabase (Postgres + RLS) |
| Auth | Supabase Auth |
| Wallet | Solana Wallet Adapter |
| Token Check | @solana/web3.js + SPL Token |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- An Anthropic API key
- A Supabase project (optional for local dev — app degrades gracefully without it)
- A Solana wallet for token-gating (Phantom or Solflare)

### 1. Clone and install

```bash
git clone https://github.com/Datwebguy/crucible.git
cd crucible
npm install --ignore-scripts
```

> The `--ignore-scripts` flag is required because a transitive dependency (`@stellar/stellar-sdk`) has a postinstall script that requires `yarn`. All packages install correctly with this flag.

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```env
# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Supabase (optional for local dev)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Solana
NEXT_PUBLIC_SOLANA_RPC=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_CRUCIBLE_TOKEN_MINT=your-token-mint-address
CRUCIBLE_TOKEN_MINIMUM_HOLD=1000
```

Without Supabase keys, rate limiting is bypassed and saving is disabled. The core analysis engine works with only `ANTHROPIC_API_KEY`.

### 3. Set up the database

In your Supabase project, go to the SQL Editor and run the contents of `supabase-schema.sql`. This creates the `analyses` and `usage` tables with the correct RLS policies.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
crucible/
├── app/
│   ├── layout.tsx              # Root layout — fonts, wallet providers
│   ├── page.tsx                # Landing page
│   ├── globals.css             # Tailwind base + CSS vars
│   ├── app/
│   │   ├── page.tsx            # Main analysis tool
│   │   └── history/
│   │       └── page.tsx        # Saved analyses (token holders only)
│   ├── token/
│   │   └── page.tsx            # CRUCIBLE token info + balance check
│   └── api/
│       ├── analyze/route.ts    # Runs the 4 agents sequentially
│       ├── save-analysis/      # Saves analysis to Supabase
│       ├── check-token/        # Checks CRUCIBLE token balance
│       └── history/            # Fetches saved analyses
├── components/
│   ├── AgentCard.tsx           # Individual agent output card
│   ├── AnalysisInput.tsx       # Input form with examples
│   ├── FlowCanvas.tsx          # Animated node graph background
│   ├── Logo.tsx                # Hexagon mark + wordmark
│   ├── Navbar.tsx              # Top nav with wallet button
│   ├── ProgressStepper.tsx     # I → II → III → IV progress bar
│   ├── SavedAnalysisCard.tsx   # Card for history page
│   ├── TokenGate.tsx           # Guards token-holder-only content
│   ├── WalletButton.tsx        # Solana wallet connect/disconnect
│   └── WalletProviders.tsx     # ConnectionProvider + WalletProvider
├── hooks/
│   ├── useAnalysis.ts          # Analysis state + API runner
│   ├── useTokenBalance.ts      # Checks CRUCIBLE balance on connect
│   └── useRateLimit.ts         # Tracks free tier usage client-side
├── lib/
│   ├── agents.ts               # All 4 agent system prompts
│   ├── anthropic.ts            # Anthropic client
│   ├── supabase.ts             # Supabase client (anon + service)
│   ├── solana.ts               # SPL token balance checker
│   └── rateLimit.ts            # Server-side rate limiting
└── types/
    └── index.ts                # Shared TypeScript types
```

---

## API Routes

### `POST /api/analyze`

Runs the four agents sequentially against the submitted text.

**Body:** `{ input: string, walletAddress?: string }`

**Response:** `{ results: Record<AgentId, string>, reasoningScore: number | null, remaining: number, isTokenHolder: boolean }`

Rate limited: 3/day for free tier, 999/day for token holders (tracked in Supabase `usage` table).

### `POST /api/check-token`

Checks a wallet's CRUCIBLE SPL token balance.

**Body:** `{ walletAddress: string }`

**Response:** `{ balance: number, isHolder: boolean }`

### `POST /api/save-analysis`

Saves a completed analysis to Supabase. Requires token holder status.

**Body:** `{ input, results, reasoningScore, walletAddress }`

### `POST /api/history`

Fetches saved analyses for a wallet. Requires token holder status.

**Body:** `{ walletAddress: string }`

---

## Deployment

### Vercel (recommended)

1. Push to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add all environment variables from `.env.local` in the Vercel dashboard
4. Deploy — builds in ~2 minutes

### Post-deploy

- Add your Vercel URL to Supabase → Authentication → URL Configuration → Allowed Origins
- Set `NEXT_PUBLIC_CRUCIBLE_TOKEN_MINT` to your token mint address once the token is live

---

## CRUCIBLE Token

The CRUCIBLE token is a Solana SPL token listed on the [Swarms Marketplace](https://swarms.world). Holding 1,000 or more tokens unlocks unlimited analyses, full history, sharing, and governance participation.

To check your balance or connect your wallet, visit the `/token` page in the app.

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Your Anthropic API key |
| `NEXT_PUBLIC_SUPABASE_URL` | No* | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No* | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | No* | Supabase service role key (server only) |
| `NEXT_PUBLIC_SOLANA_RPC` | No | Solana RPC endpoint (defaults to mainnet) |
| `NEXT_PUBLIC_CRUCIBLE_TOKEN_MINT` | No* | SPL token mint address for CRUCIBLE |
| `CRUCIBLE_TOKEN_MINIMUM_HOLD` | No | Min tokens to unlock holder tier (default: 1000) |

*App runs in degraded mode without these — analysis works, saving/history/token-gating disabled.

---

## License

MIT

---

*Built for Web3. Powered by Anthropic. Token on Solana.*
