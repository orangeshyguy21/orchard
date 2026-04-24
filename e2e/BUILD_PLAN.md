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
| `lnd-nutshell-sqlite` | lnd | nutshell | sqlite | — | 3322 |
| `lnd-cdk-sqlite` | lnd | cdk | sqlite | ✓ | 3324 |
| `cln-cdk-postgres` | cln | cdk | postgres | — | 3323 |
| `cln-nutshell-postgres` | cln | nutshell | postgres | — | 3325 |

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

### Phase 3 — Supertest tier: fidelity-first API coverage

**Framing.** Orchard is a reporting + control surface over external source-of-truth
systems (mint daemon, LN node, bitcoind, tapd, DB). The mint and node own funds;
Orchard's job is to (a) **report truthfully** what the backends say, (b) **relay
operator mutations** faithfully, (c) **aggregate event streams** correctly, and
(d) **gate its own surface**. Orchard cannot lose funds — but it *can* lie about
them, or drop mutations, or double-count events. Those are the regressions this
tier exists to catch, and catch again every time a vendor (lnd, cln, bitcoind,
nutshell, cdk, tapd) cuts a release.

Every supertest is a **differential check**: query Orchard's GraphQL, query the
backend directly (`docker exec lncli` / `lightning-cli` / `bitcoin-cli` /
`cdk-mintd` REST / `psql` / `sqlite3`), assert they agree. Mutations assert the
backend moved *and* Orchard's next read converged.

#### Fidelity domains (priority order)

- 🔴 **Read fidelity** — Orchard response == backend truth
- 🔴 **Relay fidelity** — mutations reach backend, Orchard's next read converges
- 🔴 **Event fidelity** — subscriptions emit every backend event, exactly once
- 🟡 **Aggregate consistency** — analytics totals == deterministic sum of events; backfill == live
- 🟡 **Auth surface integrity** — JWT, blacklist, roles, throttler, invite/signup
- 🔴 **Resilience** — backend down → actionable error, not crash (per AGENTS.md)

#### Phase 3.0 — Differential harness (prereq) ✅ DONE

Tier lives at `e2e/supertest/`, colocated with docker configs and shared
helpers (`e2e/helpers/`). One stack per jest run, selected via `E2E_CONFIG`
(default `lnd-nutshell-sqlite`).

- [x] `test:server:e2e` → `./e2e/supertest/scripts/run.sh` — iterates every
      config in `e2e/docker/configs/`, sequential + fail-fast (stacks must
      already be up via `npm run e2e:up all`). Per-config dispatch via
      `E2E_CONFIG` env var; debug a single config with
      `E2E_CONFIG=<name> npx jest --config ./e2e/supertest/jest.config.json`.
- [x] Active config + URL resolver: `e2e/supertest/helpers/context.ts`
- [x] HTTP GraphQL client: `gql()` — fetch-based, throws `GqlError` on errors
- [x] Subscription client: `gqlSubscribe()` — graphql-ws over native WebSocket
- [x] Real auth flow: `loginAsAdmin()` — `auth_initialization` → `auth_initialize`
      (first-run, uses stack's SETUP_KEY) → `auth_authentication`. Memoized per
      jest process. `DEV_AUTH_BYPASS` reserved but not required.
- [x] Shared docker-exec primitives extracted to `e2e/helpers/docker-cli.ts`
      (refactored out of `regtest.ts`); both tiers now share them.
- [x] Backend wrappers `e2e/supertest/helpers/backend.ts` — `backend.btc.*`,
      `backend.lnd.*`, `backend.cln.*`, `backend.ln.*` (dispatch by config.ln).
      Phase 3.0 ships minimum surface (blockCount, getInfo); grows with 3.1+.
- [x] Differential primitive: `agree(label, orchardValue, backendValue)` +
      `expectAgree([...pairs])`. Unit conversions (sat↔msat) are caller-side
      — explicit transforms at the call site read better than a transform DSL.
- [x] Replaced broken `src/server/test/app.e2e-spec.ts` stub (tested a `/`
      route that no longer exists). Live-server probe lives at
      `e2e/supertest/specs/harness.e2e-spec.ts` — 5 checks, green in <1s:
      public query, JWT issuance, bearer auth on guarded resolver, docker-exec
      reachability, and a first differential (Orchard `bitcoin_blockcount`
      agrees with `bitcoin-cli getblockcount`).

#### Phase 3.1 — Feature coverage, UI-first

**Reframed (again).** Originally scoped as fidelity differentials (query ↔
backend). Pivoted to **feature-centric**: one spec per user-facing UI
component, asserting that the component *works* — renders, shows the right
data, reacts to input, navigates correctly. Fidelity gets validated as a
side effect ("the displayed block height matches bitcoind") rather than as
the goal.

Why the pivot: data-point fidelity was over-scoped (covered fields the UI
doesn't render) and under-meaningful (didn't catch broken buttons, dead
empty-states, navigation bugs). Feature specs exercise the operator's
actual experience; if they pass, the operator can trust the feature.

**Convention:** one spec per Angular component — file named
`<component-identity>.spec.ts` (e.g., `bitcoin-general-info.spec.ts` tests
`orc-bitcoin-general-info`). Each spec = `describe` with `beforeEach` that
logs in + navigates to a page that hosts the component, plus N `test`s,
each asserting one feature behavior.

**Prior fidelity-only specs deleted** (`bitcoin-section.spec.ts`,
`index-dashboard.spec.ts`) — feature specs will cover the same ground more
meaningfully.

**Done:**
- [x] `e2e/specs/00-initialization.spec.ts` — first-run admin setup UI flow.
      Renamed + prefixed to sort first within a project so on fresh stacks it
      runs before any spec that needs an authed session. Skips gracefully on
      already-initialized stacks.
- [x] `e2e/specs/bitcoin-general-info.spec.ts` — the "Info" card. Asserts
      card renders, displays chain name + block height matching bitcoind, and
      "Open Bitcoin" button navigates via menu to `/bitcoin`.
- [x] Shared helpers in `e2e/helpers/` (framework-agnostic): `agree.ts`,
      `backend.ts` (docker-exec readers), `gql-intercept.ts`.
      `interceptOnNavigation` eagerly reads each body *inside* its waiter —
      Playwright GC's response bodies once the owning navigation settles,
      racing any deferred `response.json()` on slower stacks.
- [x] Deleted duplicate `e2e/supertest/specs/chain.e2e-spec.ts` — Playwright
      covers it via the consumer path.

**Next up (by page, criticality order):**

`/` index page components:
- [ ] `orc-bitcoin-general-wallet-summary` — lightning / tapd / oracle summary tile
- [ ] `orc-index-subsection-dashboard-bitcoin-enabled-blockchain` — fee / block template tile
- [ ] `orc-index-subsection-dashboard-bitcoin-enabled-syncing` — IBD/sync state
- [ ] The mint section card on the index (component TBD on recon)
- [ ] The lightning section card on the index

`/bitcoin`, `/lightning`, `/mint`, `/event`, `/crew`, `/settings/*`, `/bitcoin/oracle`, `/ecash`:
- [ ] Walk the component tree per page; one spec per user-visible component.

**Known follow-ups:**
- [ ] **Playwright `storageState` for login re-use.** Every spec currently
      re-runs `loginViaUi` (~600ms × N specs × 4 configs). Idiomatic fix: a
      per-config setup project that authenticates once and persists auth
      state to a temp file, referenced by sibling test projects via
      `use: {storageState: ...}`. Worth doing once spec count passes ~6
      per config; real pain at 10+.

**Each new feature spec should:** 1) identify which Angular component it
tests (filename = component identity), 2) assert render + visible content,
3) assert interaction paths the operator actually uses (buttons, menus,
navigation), 4) pull fidelity into assertions via visible text, not wire
intercepts — unless a non-rendered field is load-bearing somewhere.

#### Phase 3.1b — Non-UI API coverage (deferred)

Resolvers the UI doesn't exercise yet (rare admin paths, subscriptions
with specific timing needs, vendor-bump regression matrix where browser
overhead is too slow). Addressed only after Phase 3.1 completes and we
can identify the remaining gaps. Lives in the existing supertest tier.

#### Phase 3.2 — Relay fidelity: mutation lifecycles (🔴)

Orchard drives the mutation → assert backend state moved AND Orchard's next read converges.

- [ ] **Mint quote:** `createMintQuote` → quote row in mint DB, invoice matches
      → external node pays → poll/subscribe to `PAID` → proofs issued
      → `mintBalances` matches mint aggregate
- [ ] **Melt quote:** `createMeltQuote` → fees/amount agree → submit proofs
      → LN payment visible on external node AND `lncli listpayments`
      → both views show `PAID`
- [ ] **Swap:** split proofs → old spent (mint DB + Orchard) → new valid
- [ ] **Keyset rotation:** `rotateKeyset` → mint `/v1/keysets` shows new active
      → Orchard converges → old keyset still resolves for legacy verification
- [ ] **NUT-04/05 settings:** `updateNut04Settings` / `updateNut05Settings`
      → mint config changed (restart-persistent) → Orchard read reflects
- [ ] **Quote state:** `updateNut04QuoteState` / `updateNut05QuoteState`
      → mint DB row changes, Orchard converges
- [ ] **DB backup/restore:** `backupDatabase` produces valid dump
      → `restoreDatabase` round-trip preserves a known quote+proof

#### Phase 3.3 — Event fidelity: subscriptions (🔴)

- [ ] `blockCountSubscription`: subscribe → `mine(5)` → exactly 5 emissions,
      monotonically increasing, matching `bitcoin-cli getblockcount` at each step
- [ ] `oracleBackfillSubscription`: trigger `backfillBitcoinOracle` → progress
      monotonically advances → final count == oracle table row count
- [ ] **No drops under load:** `mine(20)` rapidly → all 20 emissions received
- [ ] **Reconnect:** drop WS mid-stream → resubscribe → document whether
      Orchard dedupes or re-emits (test whichever is specified)

#### Phase 3.4 — Aggregate consistency: analytics (🟡)

Drive a **known** sequence of ops; assert totals match hand-computed expectation
AND converge between live ingestion and backfill.

- [ ] Seed N mints, M melts, K swaps with known amounts/fees
- [ ] `operationAnalytics`, `meltAnalytics`, `swapAnalytics`, `feeAnalytics`,
      `proofAnalytics`, `promiseAnalytics`, `balanceAnalytics`, `keysetAnalytics`,
      `analyticsMetrics` equal hand-computed totals
- [ ] `lnLocalBalanceAnalytics` / `lnRemoteBalanceAnalytics` reflect channel
      state after a forwarded payment (delta == forward amount + fee)
- [ ] `btcAnalytics` aligns with oracle table rows
- [ ] **Backfill idempotency:** wipe analytics → run backfill → totals match
      live-ingestion totals from the first run
- [ ] `backfillStatus` across all three domains reports completion correctly
- [ ] Open question from Phase 1 log: wait-for-ingestion helper — checkpoint
      processing is async; may need `await settled()` primitive

#### Phase 3.5 — Auth surface integrity (🟡)

Orchard-internal (no backend differential); protects the relay surface above.

- [ ] `authenticate` happy path + wrong password
- [ ] `refreshToken` valid / reused (blacklisted) / expired
- [ ] `revokeToken` blocks subsequent requests; blacklist persists across restart
- [ ] `initialize` rejects second call; `SETUP_KEY` enforcement
- [ ] `signup` requires valid unconsumed invite; consumed invite rejected
- [ ] Admin-only resolvers reject user-role JWT (spot check: `updateSettings`,
      `rotateKeyset`, `deleteCrewUser`, `backupDatabase`)
- [ ] Unauthenticated → 401 on protected resolvers; public resolvers reachable
- [ ] Throttler fires on burst; window resets
- [ ] User CRUD: `updateUserPassword` stores bcrypt hash (verified by re-auth);
      `deleteCrewUser` deactivates; `crewInvites` CRUD round-trip

#### Phase 3.6 — Resilience (🔴, deferred until base is green)

Per AGENTS.md — actionable errors, not stack traces.

- [ ] `docker pause orchard-lnd` → `lnInfo` returns typed error with config
      hint, no 500
- [ ] `docker pause bitcoind` → `blockCount` surfaces "bitcoind at $HOST
      unreachable" style message
- [ ] `docker pause cdk-mintd` → `mintInfo` errors actionably
- [ ] Postgres down (cln-cdk-postgres) → analytics writes don't crash server
- [ ] Invalid state transitions (melt quote already paid, mint quote expired)
      → typed error codes

#### Phase 3.7 — Config-scoped differential (🟡)

Run 3.1 + 3.2 against `lnd-cdk-sqlite` to catch cdk-vs-nutshell adapter drift.

- [ ] Same differential assertions, swapped backend helpers
- [ ] Tapass reads: `taprootAssetsInfo`, `taprootAssets`, `taprootAssetsUtxos`
      vs `tapcli assets list` / `listutxos`
- [ ] Postgres configs: defer unless differential reveals ORM-specific drift

#### Phase 3.8 — Skip / defer to other tiers

- AI chat / agents — non-deterministic, unit-test the adapter
- System metrics — environmental
- Event log — Orchard-internal; covered as side-effect assertions in 3.2
- Public utilities (image proxy, port reachability) — low value
- Scheduled cron handlers — unit-test the handler directly

#### Vendor-release regression lever

This tier exists to catch vendor-release drift. One CI workflow with inputs
`lnd_tag`, `cln_tag`, `bitcoind_tag`, `nutshell_tag`, `cdk_tag`, `tapd_tag`
re-runs 3.1–3.4 against bumped images. Differential passes → release safe to
pin. Differential fails → the diff localizes which backend API drifted.

- [ ] PR gate: 3.0–3.3 against `lnd-nutshell-sqlite` (<5 min)
- [ ] Nightly: add 3.4–3.6
- [ ] Vendor-bump matrix: 3.1–3.4 across all 4 configs with new image tags

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
- **2026-04-17** — Phase 3.0 harness shipped. Chose `e2e/supertest/` over
  `src/server/test/` so both e2e tiers (Playwright + supertest) share the
  `e2e/helpers/` dir cleanly (no `../../../../` imports). Extracted
  `btcCli`/`lndCli`/`clnCli` primitives from `regtest.ts` into shared
  `docker-cli.ts` — backend wrappers now layer on top without duplication.
  Auth flow uses real JWT path (no bypass) — every spec exercises
  `auth_initialize` + `auth_authentication` as a side effect. Removed
  `src/server/test/app.e2e-spec.ts` (stub tested a `/` route that no
  longer exists). Probe passes 5/5 in ~0.5s against `lnd-nutshell-sqlite`.
- **2026-04-19** — Phase 3.1 reframed again — **feature-centric** over
  fidelity-centric. Previous fidelity specs validated that values agreed
  across the wire but didn't validate the operator's experience (dead
  buttons, wrong empty states, navigation bugs would all pass). Pivoted to
  one spec per Angular component (`<component-identity>.spec.ts`),
  asserting render + visible content + interaction paths. Fidelity falls
  out of visible-text assertions rather than being the goal. Deleted
  `bitcoin-section.spec.ts` and `index-dashboard.spec.ts`. First feature
  spec: `bitcoin-general-info.spec.ts` covering the "Info" card on `/`.
  Port-bump: e2e stacks moved +1 (3322–3325) so `3321` stays free for
  local dev. Admin password now `testere2e` (6-char minimum enforced by
  auth-init form).
- **2026-04-17** — Phase 3.1 reframed **UI-first**. Original scope was
  "every read resolver, tested via supertest differential." Walked back
  after realizing the Angular client stores queries as plain string exports
  (zero runtime deps, observable on the wire). Playwright can drive the
  page, intercept the response, and differential — **no query duplication
  anywhere**. Coverage now naturally tracks what operators actually consume;
  dead-code resolvers defer to Phase 3.1b. Shared helpers (`agree`, `backend`)
  moved to `e2e/helpers/` so both tiers can use them. New helper
  `gql-intercept.ts` gives specs `matchGql(name)` + `gqlData(res, name)`.
  First spec (`bitcoin-section.spec.ts`) passes 4/4 configs in ~800ms each,
  covers both queries that fire on `/bitcoin`. Smoke spec renamed
  `initialization.spec.ts` and narrowed to just the first-run UI flow
  (skips gracefully on initialized stacks).
- **2026-04-17** — Phase 3.0 `/simplify` pass. Three review agents flagged
  duplication + naming divergence; fixed the durable bits: extracted
  `LnNode` + `containerForNode` + `isLnd` into `e2e/helpers/config.ts`
  (shared between `regtest.ts` and `backend.ts`), consolidated admin creds
  into `TEST_ADMIN` so Playwright + supertest tiers login as the same user
  (was a latent cross-tier collision when both ran against one stack),
  dropped premature `lnd`/`cln` namespaces from `backend.ts` in favor of
  the unified `ln` dispatcher, and pruned WHAT-narrating header comments
  across all new files. Also wired `test:server:e2e` to iterate every
  config sequentially fail-fast via `scripts/run.sh`. Full matrix green:
  20/20 tests across all 4 configs in ~2s.
- **2026-04-17** — Phase 3 reframed as **fidelity-first**. Earlier framing
  ("break = operator loses funds") was wrong: the mint and LN node own funds,
  Orchard only reports/relays. Rewrote Phase 3 around four fidelity domains
  (read, relay, event, aggregate) + auth-surface integrity + resilience.
  Every supertest becomes a differential check: Orchard GraphQL vs direct
  backend query (`docker exec` into lncli / lightning-cli / bitcoin-cli /
  mintd REST / psql / sqlite3). Tier's primary CI purpose: catch vendor-
  release drift (lnd, cln, bitcoind, nutshell, cdk, tapd) via an image-tag
  matrix workflow.

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
