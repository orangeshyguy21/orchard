# E2E Testing Framework — Build Plan

End-to-end testing for Orchard using Docker-based regtest Lightning + Bitcoin
stacks, real mints, real Taproot Assets daemon, and Playwright driving the real
Angular client against a Dockerized Orchard server.

Goal: highest-fidelity coverage we can run in CI without touching mainnet,
covering the LN × Mint × DB matrix operators deploy.

---

## Locked decisions

- **Four configs** as a diagonal across (LN × Mint × DB) — each axis covered twice.
  - `lnd-nutshell-sqlite`
  - `lnd-cdk-sqlite` (with tapd)
  - `cln-cdk-postgres`
  - `cln-nutshell-postgres`
- **Dockerize Orchard** from repo source inside every config (hermetic).
- **Test runner**: Playwright (browser + API). Keep Jest + supertest tier for
  fast API smoke tests against one config.
- **Test DB isolation: per-spec-file**. Each `.spec.ts` file owns a narrative;
  tests inside share state. Heavy reset across configs not feasible because
  Orchard is containerized — test-scoped cleanup/fixtures handle drift.
- **Channel funding**: dynamic setup script on every `compose up` — mines,
  funds, opens channel topology. No committed chain fixtures.
- **Macaroons / certs / runes**: generated fresh per compose-up. No committed
  credential fixtures.
- **Ollama**: point at dev machine's Ollama endpoint. No container.
- **Karma unit tests**: kept as-is.
- **Auth**: admin seeded via `SETUP_KEY` on Orchard boot; browser specs
  exercise real login UI. `DEV_AUTH_BYPASS` reserved for supertest tier only.

---

## Config matrix

| Config | LN | Mint | DB | Tapd | Orchard port |
|---|---|---|---|---|---|
| `lnd-nutshell-sqlite` | lnd | nutshell | sqlite | — | 3321 |
| `lnd-cdk-sqlite` | lnd | cdk | sqlite | ✓ | 3323 |
| `cln-cdk-postgres` | cln | cdk | postgres | — | 3322 |
| `cln-nutshell-postgres` | cln | nutshell | postgres | — | 3324 |

### Topologies

**lnd configs** (`lnd-nutshell-sqlite`, `lnd-cdk-sqlite`):
```
lnd-alice ⇄ lnd-orchard ⇄ lnd-bob     (no direct alice↔bob channel)
```
Plus tapd (if applicable), mint backed by `lnd-orchard`, Orchard on top.

**cln configs** (`cln-cdk-postgres`, `cln-nutshell-postgres`):
```
cln-alice ⇄ cln-orchard ⇄ lnd-carol   (cross-implementation cln↔lnd)
```
Plus mint backed by `cln-orchard`, Orchard on top.

No direct alice↔far-node channel in either topology — forces routing through
Orchard so forwarding analytics get exercised.

### Scenarios each config covers

- Mint quote: `alice → orchard` → ecash minted → analytics credit
- Melt: user melts → `orchard → far-node` → analytics debit
- Forward: `alice → orchard → far-node` → analytics forward fee
- (lnd-cdk-sqlite only) Taproot assets: mint on `tapd-orchard`, transfer to `tapd-alice`

---

## Directory layout (current)

```
e2e/
├── docker/
│   ├── setup.Dockerfile                # shared alpine+tools image
│   ├── scripts/
│   │   ├── compose.sh                  # dispatcher: up/down/logs/ps [all]
│   │   ├── fund-lnd-topology.sh        # setup service body for lnd configs
│   │   └── fund-cln-topology.sh        # setup service body for cln configs
│   └── configs/
│       ├── lnd-nutshell-sqlite/
│       ├── lnd-cdk-sqlite/
│       ├── cln-cdk-postgres/
│       └── cln-nutshell-postgres/
└── README.md
```

Phase 2+ will add:

```
e2e/
├── fixtures/
│   ├── client-config.json              # served as /config.json to Angular
│   └── seed.ts                         # admin user + SETUP_KEY bootstrap
├── helpers/
│   ├── orchard.ts                      # Orchard URL resolver per config
│   ├── gql.ts                          # authed apollo + graphql-ws clients
│   ├── login.ts                        # UI + API login helpers
│   └── regtest.ts                      # mine, pay, invoice, channels
├── specs/
│   ├── shared/                         # runs against all 4 configs
│   │   ├── auth.spec.ts
│   │   ├── mint-quote.spec.ts
│   │   ├── melt.spec.ts
│   │   ├── ln-invoice.spec.ts
│   │   ├── subscriptions.spec.ts
│   │   └── analytics.spec.ts
│   └── lnd-cdk-sqlite/
│       └── taproot-assets.spec.ts      # only config with tapd
├── playwright.config.ts                # 4 projects, one per config
```

---

## npm scripts (current)

```
npm run e2e:up    <config|all>
npm run e2e:down  <config|all>
npm run e2e:logs  <config>
npm run e2e:ps    <config|all>
```

Phase 2+ adds:
```
npm run e2e:test  <config>              # playwright --project=<config>
test:server:e2e                         # existing supertest tier against lnd-nutshell-sqlite
```

---

## Phased rollout

### Phase 1 — Docker stacks ✅ DONE

- [x] `setup.Dockerfile` (shared)
- [x] `fund-lnd-topology.sh` (mines 101 → funds 10 BTC each node → opens
      `alice↔orchard` + `orchard↔bob` channels → mines 6 → waits active)
- [x] `fund-cln-topology.sh` (same topology, cln drivers + lnd-carol; optional
      rune creation via `CREATE_RUNE_FOR` for clnrest auth)
- [x] `configs/lnd-nutshell-sqlite/` (7 services)
- [x] `configs/lnd-cdk-sqlite/` (9 services + tapd)
- [x] `configs/cln-cdk-postgres/` (8 services + postgres)
- [x] `configs/cln-nutshell-postgres/` (8 services + postgres + clnrest rune)
- [x] `compose.sh` dispatcher — `up/down/logs/ps` + `all` meta-config
- [x] `npm run e2e:*` wired
- [x] All 4 configs smoke-green

### Phase 2 — Playwright scaffolding ✅ DONE (slices A+B)

- [x] Install `@playwright/test` + chromium
- [x] `e2e/playwright.config.ts` with 4 projects (one per config), `workers: 1`,
      trace + screenshot on failure, artifacts under `e2e/test-results/`
- [x] `e2e/helpers/config.ts` — per-project metadata (container names, topology)
- [x] `e2e/helpers/setup.ts` — first-run admin creation via UI
- [x] `e2e/helpers/regtest.ts` — docker-exec wrappers for bitcoin-cli / lncli /
      lightning-cli (`mine`, `chainHeight`, `payInvoice`, `newInvoice`)
- [x] `e2e/specs/smoke.spec.ts` — exercises all three helpers end-to-end
- [x] `npm run e2e:test <config>` wired

Deferred to when first spec needs them:
- [ ] `e2e/helpers/login.ts` — post-admin login flow
- [ ] `e2e/helpers/gql.ts` — authed Apollo + `graphql-ws` (phase 4 likely
      doesn't need this if backend coverage stays in Jest tier)

### Phase 3 — Supertest tier integration

- [ ] Rewrite `src/server/test/app.e2e-spec.ts` stub → real auth + mint quote
      API test against `lnd-nutshell-sqlite` backends
- [ ] `test:server:e2e` runs after `e2e:up lnd-nutshell-sqlite` in CI
- [ ] `DEV_AUTH_BYPASS=true` used only here, not in Playwright tier

### Phase 4 — Shared specs (all 4 configs)

- [ ] `auth.spec.ts` — login, token refresh, logout, blacklist enforcement
- [ ] `mint-quote.spec.ts` — external node pays invoice → ecash issued → UI shows balance
- [ ] `melt.spec.ts` — user melts → external node receives → UI shows decrement
- [ ] `ln-invoice.spec.ts` — Orchard creates invoice → external pays → UI shows settled
- [ ] `subscriptions.spec.ts` — `graphql-ws` subscription receives live payment event
- [ ] `analytics.spec.ts` — N known operations → assert analytics totals match exactly

### Phase 5 — Config-specific specs

- [ ] `lnd-cdk-sqlite/taproot-assets.spec.ts` — mint asset on `tapd-orchard`,
      transfer to `tapd-alice`, verify balances in both tapd + Orchard UI
- [ ] Placeholders for future config-specific edge cases

### Phase 6 — CI wiring

- [ ] GitHub Actions workflow: matrix job `config: [lnd-nutshell-sqlite, ...]`
      (4-way matrix, each on its own runner)
- [ ] Docker layer caching keyed on compose file + Dockerfile hashes
- [ ] Upload Playwright traces + container logs as artifacts on failure
- [ ] PR-default: `lnd-nutshell-sqlite` + `cln-cdk-postgres` (covers both
      mints, both LNs, both DBs); other 2 gated on `e2e:full` label
- [ ] Nightly: all 4 run
- [ ] Update `e2e/README.md` with CI notes

---

## Session log

- **2026-04-17** — Phase 1 done. Original scope was 2 "pairs"; expanded to a
  4-config diagonal after realizing mint × DB × LN axes each need coverage.
  Key pitfalls resolved along the way: LND healthchecks needed `--lnddir`
  override (runs as root); tapd user is `tap` not `tapd`; CLN 25.12 defaults
  to BIP86 signing — fund Taproot addresses not P2WPKH; cdk-mintd image is
  `cashubtc/mintd` on Docker Hub, not `cdk-mintd` on ghcr; cln-nutshell
  requires clnrest plugin + rune auth (rune minted by setup script, injected
  into nutshell env via wrapper entrypoint).
- **2026-04-17** — Phase 2 scaffolding done. Chose **Playwright hybrid**:
  UI-only flows in Playwright, backend/API coverage deferred to Jest +
  supertest (Phase 3). Smoke spec exercises helper chain end-to-end in ~4s.
  Helpers drive regtest via `docker exec` rather than shipping certs to the
  host — same pattern as the setup scripts.

---

## Open questions to revisit

- Channel capacity / split ratios — may need tuning once real payment flows
  run and we see liquidity constraints
- Whether analytics assertions need a wait-for-ingestion helper (checkpoint
  processing is async)
- Postgres DB reset strategy for per-spec-file isolation — either
  `TRUNCATE CASCADE` via psql, or recreate the compose stack (slow)
- Whether `lnd-bob` needs a `tapd` sibling for asset-routing tests (defer
  until taproot spec is written)
- Whether to add a light-mode compose variant (skip tapd or mint) for
  faster PR feedback
