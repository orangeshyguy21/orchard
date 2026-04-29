# `orc-mint-general-balance-sheet`

Source: [mint-general-balance-sheet.component.ts](../../src/client/modules/mint/modules/mint-general/components/mint-general-balance-sheet/mint-general-balance-sheet.component.ts) · [`.html`](../../src/client/modules/mint/modules/mint-general/components/mint-general-balance-sheet/mint-general-balance-sheet.component.html)

## Purpose

The **Balance Sheet** card on the dashboard (`/`) and the mint subsection dashboard (`/mint`) summarising assets vs. liabilities for each Cashu mint unit. It is a pure presentational container — no service calls, no subscriptions of its own. Its job is to render:

- one row per mint unit (sat / msat / btc / usd / eur), sorted btc → sat → msat → usd → eur, with rows of the same unit collapsed into a single row whose liabilities + fees are summed across that unit's keysets
- per row: an **Assets** cell (Lightning local capacity for bitcoin units; a `—` placeholder for fiat units), an optional **Visual** cell (a coin-stack pyramid on desktop only), a **Liabilities** cell (unspent ecash for that unit), and an **Active keyset** chip (Gen X · ppk)
- an expand toggle that reveals additional per-unit detail cards: mint unit name, liability coverage (assets ÷ liabilities), fee revenue, and — for bitcoin units when the bitcoin oracle is enabled — a USD-converted Oracle subcard

The card emits a `navigate` output when Lightning is disabled at the runtime-config level and the user clicks the per-row "Lightning Configuration" button — the parent routes to `/lightning`.

## Where it renders

- **Dashboard tile** — [`orc-index-subsection-dashboard-mint-enabled`](../../src/client/modules/index/modules/index-subsection-dashboard/components/index-subsection-dashboard-mint-enabled/index-subsection-dashboard-mint-enabled.component.html:38) on `/`. Mounted only when `enabled_mint` is true in runtime config AND the parent's `loading()` is false (the whole `mint-enabled` block is wrapped in `@if (!loading())`). The parent forwards `loading=loading()` and routes the `(navigate)` output through its own `navigate.emit('lightning')`.
- **Mint subsection dashboard summary tile** — [`orc-mint-subsection-dashboard`](../../src/client/modules/mint/modules/mint-subsection-dashboard/components/mint-subsection-dashboard/mint-subsection-dashboard.component.html:44) on `/mint`. Always mounted within the loaded mint dashboard (no parent-level gating beyond the dashboard's own load gate). `(navigate)` is wired to the dashboard's `onNavigate('lightning')`.

Neither parent projects anything into the component (this component has no `<ng-content>` slot).

## Inputs

| Input | Type | Required | Notes |
|---|---|---|---|
| `balances` | `MintBalance[]` | ✓ | From the `mintBalances` query, wrapped in [`MintBalance`](../../src/client/modules/mint/classes/mint-balance.class.ts). One entry per keyset id with its outstanding ecash balance. |
| `keysets` | `MintKeyset[]` | ✓ | From the `mintKeysets` query, wrapped in [`MintKeyset`](../../src/client/modules/mint/classes/mint-keyset.class.ts). The driver of row generation — every keyset becomes a row, then rows of the same `unit` are merged. |
| `lightning_balance` | `LightningBalance \| null` | ✓ | From the `lightningBalance` query, wrapped in [`LightningBalance`](../../src/client/modules/lightning/classes/lightning-balance.class.ts). Only `lightning_balance.open.local_balance` is read (treated as the BTC asset side of the sheet). `null` before first response. |
| `lightning_enabled` | `boolean` | ✓ | Runtime-config flag (`window.config.enabled_lightning`). When false, every row's Assets cell is replaced with a "Lightning Configuration" button that emits `(navigate)`. |
| `lightning_errors` | `OrchardError[]` | optional (default `[]`) | Parent's `errors_lightning[]` array. Non-empty ⇒ each row's Assets cell is replaced with one `orc-error-resolve` per error. |
| `lightning_loading` | `boolean` | ✓ | Parent's `loading_lightning()`. While true, the inner `@if (!lightning_loading())` short-circuits and the Assets cell renders empty. |
| `bitcoin_oracle_enabled` | `boolean` | ✓ | Runtime-config flag (`window.config.enabled_bitcoin_oracle`). Combined with `row.is_bitcoin` to gate the expanded Oracle subcard. |
| `bitcoin_oracle_price` | `BitcoinOraclePrice \| null` | ✓ | From the `bitcoinOraclePrice` query. Drives `liabilities_oracle` / `assets_oracle` / `fees_oracle` on each row via `oracleConvertToUSDCents()`; `null` when the oracle is disabled or the latest price hasn't arrived. |
| `loading` | `boolean` | ✓ | Parent's `loading_static_data` — guards row generation in `ngOnChanges`. While true, `rows()` stays empty (whatever was last set). |
| `device_type` | `'desktop' \| 'tablet' \| 'mobile'` | ✓ | Drives the responsive grid: desktop renders Assets · Visual · Liabilities · Keyset/Toggle as four columns; tablet drops the Visual cell and pulls the keyset chip into the expanded section; mobile collapses Assets + Toggle into one row and pushes Liabilities to a second row, with the keyset chip inside the expanded section. |

## Outputs & projected content

- `(navigate)` — `EventEmitter<void>` fired only from the per-row "Lightning Configuration" button (Lightning-disabled state). Both parents route it to `/lightning` navigation. Not fired by the toggle, by the keyset chip, or by any of the expanded-section cards.
- No `<ng-content>` slot.

## Derived / computed signals

This component has no `computed()` signals on its public surface. Its rendered shape is driven by two writable signals:

- `rows` → `signal<MintGeneralBalanceRow[]>([])` — populated by `init()` (which is called from `ngOnChanges` when `loading` flips false, when `lightning_balance` first arrives non-null, or when `bitcoin_oracle_price` first arrives non-null). Each row is a [`MintGeneralBalanceRow`](../../src/client/modules/mint/modules/mint-general/components/mint-general-balance-sheet/mint-general-balance-row.class.ts) carrying:
  - `unit_mint` (e.g. `'sat'`, `'usd'`)
  - `unit_lightning` (always `'sat'`)
  - `assets` — `lightning_balance.open.local_balance` for bitcoin-eligible units, `null` for `usd`/`eur`
  - `liabilities` — sum of `balance.balance` across all keysets sharing this unit
  - `liabilities_oracle` / `assets_oracle` / `fees_oracle` — USD-cent conversions via `oracleConvertToUSDCents()` keyed off `bitcoin_oracle_price.price`; `null` for non-bitcoin units OR when oracle price is null
  - `fees` — sum of `keyset.fees_paid`
  - `active`, `derivation_path_index`, `input_fee_ppk` — taken from the most-recent (highest `derivation_path_index`) keyset for the unit; lower-index keysets only contribute to `liabilities` / `liabilities_oracle` / `fees` / `fees_oracle` totals
  - `is_bitcoin` — `eligibleForOracleConversion(unit)`: true for `'sat' | 'msat' | 'btc'`
  - `reserve` (getter) — `null` if `assets === null` OR if normalised `liabilities === 0`; otherwise `Math.ceil(assets) / liabilities_in_pipe_unit`, rounded to one decimal when the multiple is < 5 and to integer when ≥ 5
- `expanded` → `signal<Record<string, boolean>>({})` — keyed by `unit_mint`, toggled by `toggleExpanded(unit)`. Drives the `.animation-expanded` class on each row's `.balance-sheet-details` block.

## Happy path

1. Parent mounts inside `@if (!loading())` (dashboard) or unconditionally (mint subsection dashboard) and supplies live `keysets`, `balances`, `lightning_balance`, `lightning_enabled`, `lightning_loading`, `bitcoin_oracle_*`, `loading`, `device_type`.
2. `ngOnChanges` fires with `loading: false` → `init()` builds rows: one row per keyset, lower-index rows merged into the highest-index row of the same unit, then sorted by the `currency_order` table (`btc:1, sat:2, msat:3, usd:4, eur:5`).
3. The "Balance Sheet" title renders, followed by one `mat-card.balance-sheet-card` per row.
4. Each row renders: Assets cell on the left, Visual cell in the middle (desktop only), Liabilities cell, then the inline keyset chip + toggle button on the right (desktop) or just the toggle (tablet/mobile).
5. Clicking anywhere on a row's `.balance-sheet-row` (the `matRipple` host) toggles that unit's expanded panel — the panel reveals Mint unit, Liability coverage (only when assets ≠ null), and Fee revenue cards, plus the Oracle subcard if `row.is_bitcoin && bitcoin_oracle_enabled()`.
6. On tablet and mobile, the keyset chip lives inside the expanded panel rather than in the row's right cell.

## Reachable states

### 1. Single bitcoin row, lightning enabled, oracle disabled (live)

Live state on `lnd-nutshell-sqlite` `/` (and `/mint`). The mint daemon ships one keyset (`unit: 'sat'`, `derivation_path_index: 0`, `input_fee_ppk: 100`).

- one `mat-card` rendered, unit `sat`
- Assets cell: bitcoin lightning glyph + `₿ 10,000,139` + sublabel "Assets ● Lightning local capacity"
- Liabilities cell: bitcoin ecash glyph + `₿ 6,584` + sublabel "Liabilities ● Unspent ecash"
- Inline keyset chip (desktop): `Gen 0 100 ppk` with green active dot, sublabel "Active keyset"
- Toggle button collapsed; expanded panel hidden via CSS but present in DOM with `.balance-sheet-details` class (not `.animation-expanded`)

### 2. Row expanded — bitcoin row, oracle disabled

After clicking the row (or the toggle button). Same input shape as state 1.

- `.balance-sheet-details` adds `.animation-expanded` class
- Three `.orc-high-card` tiles: `SAT / Mint unit`, `1519x / Liability coverage`, `₿ 10 / Fee revenue` (the integers reflect live regtest values; `reserve = ceil(10000139)/6584 ≈ 1519`)
- No Oracle subcard (gate fails on `bitcoin_oracle_enabled === false`)

### 3. Row expanded — bitcoin row, oracle enabled

Synthetic: override `bitcoin_oracle_enabled` and `bitcoin_oracle_price` and recompute the row's `_oracle` fields.

- All three high-cards from state 2 still render
- Below them: `.orc-primary-card` with header "Oracle" + price-date sublabel, then three USD-converted figures: `$ 9,500.13 / Assets`, `$ 6.25 / Liabilities`, `$ 0.01 / Fee revenue`
- The Oracle card is the only place the user sees fiat-converted bitcoin amounts; no `cents → dollars` rounding artefact in the test fixtures observed

### 4. Multi-row — sat + usd + eur

Synthetic: inject one row per fiat unit. Sort order is enforced by `currency_order`: btc, sat, msat, usd, eur.

- three `mat-card` cards in `[btc, sat, msat, usd, eur]` order (subset present)
- bitcoin row renders as state 1 / 2
- `usd` row: green "$"+lightning glyph in Assets cell with placeholder `—` (`<mat-icon>check_indeterminate_small</mat-icon>`); Visual cell (desktop) renders an empty `<div></div>`; Liabilities cell shows `$ 24.11 / Liabilities ● Unspent ecash` (cents-divided-by-100 via `LocalAmountPipe`); inline keyset chip on desktop
- `eur` row: blue "€"+lightning glyph + `—` placeholder; Liabilities `€ 11.00`; same keyset chip pattern
- expanded usd/eur rows omit the Liability coverage card (gated on `assets !== null`) and never show the Oracle subcard (`is_bitcoin === false`)

### 5. Lightning disabled

`lightning_enabled === false` (runtime config flipped, no current stack ships this state).

- every row's Assets cell collapses to a single `<button mat-stroked-button>Lightning Configuration</button>`
- clicking the button emits `(navigate)` exactly once per click (verified live by attaching a subscriber and clicking)
- everything else (Liabilities cell, keyset chip, toggle, expanded panel) renders normally
- the expanded panel still renders the Liability coverage card when `row.assets !== null` — but `assets` is supplied independently of `lightning_enabled` (parent feeds whatever the LN query returned), so in practice `assets` is null whenever LN is disabled at config time, and the Liability coverage card is hidden

### 6. Lightning loading

`lightning_loading === true` (e.g. on first paint before the LN query resolves).

- every row's Assets cell renders empty (`<!--container--><!--container--><!--container-->` placeholders only)
- Liabilities cell renders normally — mint balances + keysets aren't gated on the LN query
- the row stays clickable; expanded panel still works

### 7. Lightning errors

`lightning_errors().length > 0`.

- every row's Assets cell drops the graphic + value/placeholder branch and renders one `<orc-error-resolve mode="small">` per error in a `<div animate.enter>` wrapper
- the error chip shows the error code's resolution text from the global error catalogue; `mode="small"` is fixed and not parameterised here
- This branch wins over both `assets !== null` (state 1) and `assets === null` (state 4 fiat) — every unit's Assets cell shows the error chips, regardless of unit

### 8. Empty — no keysets

`keysets()` is empty (or `null` defensively — the component uses `if (!keysets) return []`).

- title "Balance Sheet" renders
- no `.balance-sheet-card` cards rendered
- the title is the only visible content of the component

### 9. Loading — `loading === true`

`loading === true` is the initial state before the parent's `loading_static_data` flips false.

- `rows()` is the empty initial signal value (`[]`) — same DOM as state 8
- once `loading` goes false, `init()` rebuilds rows from `keysets()` + `balances()` + `lightning_balance()` + `bitcoin_oracle_price()`
- subsequent firsts of `lightning_balance` non-null and `bitcoin_oracle_price` non-null also re-run `init()` (the `firstChange` guards prevent double-init when the same change emits both)

### 10. Device variants

- **desktop** — four-column grid `1fr minmax(0,auto) 1fr auto`. Assets cell (col 1), Visual stacks (col 2), Liabilities (col 3), inline keyset chip + toggle (col 4). Expanded panel uses the full row width via `grid-column: 1 / -1`.
- **tablet** — three-column grid `1fr 1fr auto`. Visual cell skipped (`@if device === desktop` template branch is false). Inline keyset chip skipped from row's right cell — the chip moves into the expanded panel's per-row section.
- **mobile** — flex-column. Per-row layout is a 2×2 grid: Assets + Toggle on the top, Liabilities spanning the bottom. Keyset chip again lives inside the expanded panel.

The desktop-only Visual cell is an [`orc-mint-general-balance-stacks`](../../src/client/modules/mint/modules/mint-general/components/mint-general-balance-stacks/mint-general-balance-stacks.component.ts) instance — see Child components.

## Child components

### `orc-mint-general-balance-stacks` (Visual cell, desktop only)

Source: [mint-general-balance-stacks.component.ts](../../src/client/modules/mint/modules/mint-general/components/mint-general-balance-stacks/mint-general-balance-stacks.component.ts) · [`.html`](../../src/client/modules/mint/modules/mint-general/components/mint-general-balance-stacks/mint-general-balance-stacks.component.html)

Rendered for each row when `device_type() === 'desktop'` AND `row.assets !== null` AND `row.liabilities !== null`. Otherwise an empty `<div></div>` placeholder fills the grid cell.

#### Parent → child contract

- `[unit]="row.unit_mint"` — drives the child's `unit_class` computed: `sat` → `coin-bitcoin`, `usd` → `coin-usd`, `eur` → `coin-eur`, anything else → `coin-unknown`. Note that `btc` and `msat` fall to `coin-unknown` here because the child only matches against `'sat'`/`'usd'`/`'eur'` — not the full `currency_order` set the parent sorts on.
- `[assets]="row.assets"` — number, e.g. 10_000_139
- `[liabilities]="row.liabilities"` — number, e.g. 6_584
- `[reserve]="row.reserve"` — number or null (see *Derived* signals)

#### Reachable child states

- **balanced** — `assets ≈ liabilities` ⇒ both stacks at `Math.ceil(ratio*18)` ≈ 9 coins each.
- **assets-heavy** — `assets > liabilities` ⇒ asset stack capped at 18, liability stack at `liabilities/(liabilities+assets)*18` (the regtest live state — `1519×` reserve, asset stack at 18, liability stack at 1).
- **liabilities-heavy** — `liabilities > assets` ⇒ symmetric of above. Insolvent state, never reachable from healthy regtest.
- **zero-assets / zero-liabilities** — `value = 0` ⇒ stack size 1 (single coin).
- **reserve `< 1`** (insolvent) — only the liability stack shows the reserve label and it tints `orc-status-inactive-color` (red); the asset stack hides the label via `[class.invisible]="!showReserve"`.
- **reserve `null`** — the entire reserve label is omitted (`@if (reserve() !== null)`), regardless of which stack would show it.

The pyramid shape is internal:
- 1–3 coins → 1 tier (single row)
- 4–9 coins → 2 tiers
- 10–18 coins → 3 tiers (the live BTC asset stack)

#### Child interactions

None. Pure presentational. No outputs.

### `orc-mint-general-keyset` (keyset chip)

Source: [mint-general-keyset.component.ts](../../src/client/modules/mint/modules/mint-general/components/mint-general-keyset/mint-general-keyset.component.ts) · [`.html`](../../src/client/modules/mint/modules/mint-general/components/mint-general-keyset/mint-general-keyset.component.html)

Rendered twice per row in different layouts: desktop puts it in the row's right cell, tablet/mobile move it into the expanded panel's per-row section. Both instances bind the same inputs.

#### Parent → child contract

- `[active]="row.active"` — drives `status_class` computed: `true → 'keyset-active'` (green dot), `false → 'keyset-inactive'` (muted dot).
- `[index]="row.derivation_path_index"` — rendered as `Gen {{ index }}`.
- `[input_fee_ppk]="row.input_fee_ppk"` — rendered as `{{ input_fee_ppk }} ppk` only when `> 0`. A 0-fee keyset shows just `Gen N` with the chip slot to the right empty.

#### Child interactions

None. Pure presentational. No outputs.

### `orc-graphic-asset` (per-row asset / liability glyph)

Used four times per row (Assets cell · Liabilities cell, plus their tablet/mobile variants). Always bound `[unit]="row.unit_mint" [height]="'2.5rem'" [custody]="'lightning' | 'ecash'"`. Pure decorative; not enumerated further.

### `orc-error-resolve` (per-error chip when `lightning_errors[]` is non-empty)

`mode="small"` and `[error]="error"`. Only mounted when `lightning_enabled && !lightning_loading && lightning_errors.length > 0`. Resolves to a translated string from the global error catalogue keyed by `error.code`; not enumerated here.

## Unhappy / edge cases

- **`balances` without a matching keyset** — silently dropped. `getRows` walks `keysets[]` and looks up balances by id; orphan balances (e.g. from a deleted keyset) never surface.
- **Keyset present without a matching balance** — the row still renders, with `liabilities = 0` (default in the `??` fallback inside `getRows`).
- **Multiple keysets per unit** — only the highest-`derivation_path_index` keyset's `active` / `input_fee_ppk` / `derivation_path_index` survive into the merged row. Lower-index keysets contribute to `liabilities`, `liabilities_oracle`, `fees`, `fees_oracle` totals via the `forEach` accumulator. So a unit with one inactive old keyset and one active new keyset shows the new keyset's chip but the combined liability / fee totals.
- **Unknown unit** — `currency_order` falls through to `999`, so unknown units sort last but still render. The child stacks component falls to `coin-unknown` for anything other than `'sat'/'usd'/'eur'` — meaning `btc` and `msat` rows would render with the unknown coin glyph in the Visual cell. No fixture currently emits `btc` or `msat` keysets, so this is documented but unobserved.
- **`assets = 0` with `liabilities > 0`** — `reserve` getter computes `Math.ceil(0)/liabilities = 0` ⇒ shown as `0x` and tinted red on the liability stack's label.
- **`liabilities = 0` with `assets > 0`** — `reserve` getter: `LocalAmountPipe.getConvertedAmount(unit, 0) === 0` ⇒ early return `null` ⇒ no reserve label rendered (only the asset stack shows).
- **Both zero** — `reserve === null`; both stacks render at minimum size 1; no reserve label.
- **`bitcoin_oracle_price.price = 0`** — `oracleConvertToUSDCents` returns 0 cents; the Oracle subcard renders `$ 0.00` for assets/liabilities/fees. Not surfaced as an error state.
- **`info.urls`-style malformed inputs** — does not apply here; this card has no URL parsing.
- **Toggle button clicked while LN errors are present** — expansion still works; the expanded panel renders normally regardless of asset-cell branch.

## Template structure (at a glance)

```
.balance-sheet
├── "Balance Sheet" title (.title-l)
└── .balance-sheet-list (grid; .tablet / .mobile modifier classes)
    └── @for row of rows() — track row.unit_mint
        └── mat-card.balance-sheet-card
            └── mat-card-content.balance-sheet-row (matRipple, click → toggleExpanded)
                ├── .assets-cell
                │   ├─ if !lightning_enabled → button[mat-stroked-button] "Lightning Configuration"
                │   ├─ elif lightning_errors.length > 0 → @for error → orc-error-resolve
                │   ├─ elif !lightning_loading → orc-graphic-asset + (value | dash icon)
                │   └─ else (loading) → empty
                ├─ if device === desktop:
                │   └─ .visual-cell
                │       └─ if assets !== null && liabilities !== null → orc-mint-general-balance-stacks
                │          else → empty <div>
                ├── .liabilities-cell
                │   └── orc-graphic-asset + (liabilities | localAmount: unit_mint : 'mint')
                ├── .toggle-cell
                │   ├─ if device === desktop → orc-mint-general-keyset + "Active keyset"
                │   └── button.orc-icon-button (toggle, class `.animation-expanded` when open)
                └── .balance-sheet-details (animated; .animation-expanded when open)
                    └── @if device !== desktop → orc-mint-general-keyset (mobile/tablet placement)
                    ├── .orc-high-card "{{ unit_mint | localUnit: true }} / Mint unit"
                    ├─ if assets !== null → .orc-high-card "{{ reserve }}x / Liability coverage"
                    ├── .orc-high-card "{{ fees | localAmount }} / Fee revenue"
                    └─ if is_bitcoin && bitcoin_oracle_enabled → .orc-primary-card Oracle subcard
                        ├── header "Oracle" + price-date
                        ├── "{{ assets_oracle | localAmount: 'usd' }} / Assets"
                        ├── "{{ liabilities_oracle | localAmount: 'usd' }} / Liabilities"
                        └── "{{ fees_oracle | localAmount: 'usd' }} / Fee revenue"
```

## Interaction summary

| Gesture | Target | Result |
|---|---|---|
| click row card | `.balance-sheet-row` (matRipple host) | `toggleExpanded(row.unit_mint)` — flips `expanded()[unit]` and adds/removes `.animation-expanded` class on `.balance-sheet-details` |
| click toggle button | `button.orc-icon-button` inside `.toggle-cell` | bubbles to the row's click handler (the button has `tabindex="-1"` and no own `(click)`); same as above |
| click "Lightning Configuration" button | `button[mat-stroked-button]` inside `.assets-cell` (only when `!lightning_enabled`) | emits `(navigate)` exactly once; parents route to `/lightning` |
| hover row card | matRipple on `.balance-sheet-row` | ripple — no state change |
| click anywhere inside expanded panel | `.balance-sheet-details` | bubbles to the row's click handler ⇒ collapses the panel. There is no `$event.stopPropagation()` on the inner cards, so the user cannot select text inside the expanded panel without re-collapsing it |

## Test-author handoff

### Host page + setup

- **Route**: `/` is the default test surface (the dashboard tile mounts the same component with the same input wiring as `/mint`). The `/mint` page is identical for assertion purposes — choose `/` for parity with the other dashboard specs in `e2e/specs/`.
- **`beforeEach`**: `await page.goto('/')`. Auth via `loginViaUi` for now (no shared `storageState` set up yet — see `e2e/specs/bitcoin-general-info.spec.ts` for the pattern).
- **Tag**: `@mint`. Not part of `@canary` — the live-state coverage on `lnd-nutshell-sqlite` is one row, and the multi-row / oracle / lightning-disabled paths require synthetic data which lives outside the smoke tier.

### Differential oracles

| Input | Oracle | Helper call |
|---|---|---|
| `balances` | mint daemon balances per keyset | **gap** — no helper yet. Add `mint.getBalances(config)` to [`e2e/helpers/backend.ts`](../../e2e/helpers/backend.ts), reading either Orchard's resolver via supertest or the daemon's `/v1/balances` (cdk) / mint database row sum (nutshell) before writing balance-fidelity assertions. For now, assert against the rendered text only. |
| `keysets` | mint daemon `/v1/keysets` | **gap** — no helper yet. Add `mint.getKeysets(config)` (NUT-02 returns `{keysets: [{id, unit, active, input_fee_ppk, ...}]}` for both cdk and nutshell). |
| `lightning_balance` (`open.local_balance`) | LND `channelbalance` / CLN `listfunds` | **gap** — `e2e/helpers/backend.ts` exposes `ln.onchainSats(config)` only. Add `ln.localChannelBalance(config)` returning `{local_balance, capacity}` from `lncli channelbalance` (LND) or summed `listpeerchannels.spendable_msat` (CLN). |
| `lightning_enabled` | runtime config | Read from `e2e/helpers/config.ts` if exposed there, else from the rendered DOM (presence of "Lightning Configuration" button is a proxy). All four current stacks have `enabled_lightning=true`; tests that need `false` either skip or run against a dedicated stack. |
| `lightning_errors` | parent's `errors_lightning[]` | Not a backend reading — assert on rendered `orc-error-resolve` count + the absence of asset graphics. |
| `bitcoin_oracle_enabled` | runtime config | Same shape as `lightning_enabled`. All four current stacks default to `false`. |
| `bitcoin_oracle_price` | Orchard `bitcoinOraclePrice` query | Not a regtest backend reading — the oracle pulls from external mainnet sources. Tests should not assert on price-derived numbers; assert on Oracle-subcard *presence* gated by feature flag instead. |
| `loading` | parent state | Not directly assertable — assert that the card has rows by the time `await page.goto('/')` resolves the parent's `@if (!loading())`. |
| `device_type` | layout service via BreakpointObserver | Not a backend; covered by Playwright `page.setViewportSize(...)` and the `desktop`/`tablet`/`mobile` projects. |

### State reachability matrix

| State | `lnd-nutshell-sqlite` | `lnd-cdk-sqlite` | `cln-cdk-postgres` | `cln-nutshell-postgres` |
|---|---|---|---|---|
| 1. Single bitcoin row, lightning enabled, oracle disabled | ✓ live | ✓ live | ✓ live | ✓ live |
| 2. Row expanded — bitcoin row, oracle disabled | ✓ live | ✓ live | ✓ live | ✓ live |
| 3. Row expanded — bitcoin row, oracle enabled | — fixture-only (oracle defaults off) | — fixture-only | — fixture-only | — fixture-only |
| 4. Multi-row — sat + usd + eur | — fixture-only (regtest mints seed only `sat`) | — fixture-only | — fixture-only | — fixture-only |
| 5. Lightning disabled | — fixture-only (no `enabled_lightning=false` stack) | — fixture-only | — fixture-only | — fixture-only |
| 6. Lightning loading | — synthetic (transient on first paint, race-prone to assert against) | — synthetic | — synthetic | — synthetic |
| 7. Lightning errors | — disruptive (`docker pause` the LN container) | — disruptive | — disruptive | — disruptive |
| 8. Empty — no keysets | — fixture-only (a fresh mint with no keyset generated yet — both nutshell and cdk auto-generate one on first boot) | — fixture-only | — fixture-only | — fixture-only |
| 9. Loading — `loading === true` | — synthetic | — synthetic | — synthetic | — synthetic |
| 10a. Device — desktop | ✓ live (Playwright default desktop viewport) | ✓ live | ✓ live | ✓ live |
| 10b. Device — tablet | — synthetic (use `page.setViewportSize({width: 768, height: 1024})`) | — synthetic | — synthetic | — synthetic |
| 10c. Device — mobile | — synthetic (use `page.setViewportSize({width: 375, height: 812})`) | — synthetic | — synthetic | — synthetic |

### Per-state probes

| State | Settled signal (wait for) | Primary assert |
|---|---|---|
| 1. Single bitcoin row | `card.locator('.balance-sheet-card').first()` visible | `card.locator('.balance-sheet-card')` count === 1 AND `card.locator('.assets-cell').getByText('Lightning local capacity', {exact: true})` visible |
| 2. Row expanded — oracle disabled | `.balance-sheet-details.animation-expanded` visible | `card.locator('.orc-high-card')` count === 3 (Mint unit · Liability coverage · Fee revenue) AND `card.locator('.orc-primary-card')` count === 0 |
| 3. Row expanded — oracle enabled | `card.locator('.orc-primary-card')` visible | `card.locator('.orc-primary-card').getByText('Oracle', {exact: true})` visible |
| 4. Multi-row | first `.balance-sheet-card` visible | `card.locator('.balance-sheet-card')` count matches `keysets.length`-grouped-by-unit |
| 5. Lightning disabled | first `button[mat-stroked-button]` inside `.assets-cell` visible | `card.locator('.assets-cell button[mat-stroked-button]')` count > 0 AND text === "Lightning Configuration" |
| 6. Lightning loading | `card` mounted (no inner content predicate available) | `card.locator('.assets-cell orc-graphic-asset')` count === 0 AND `card.locator('.assets-cell button[mat-stroked-button]')` count === 0 |
| 7. Lightning errors | first `orc-error-resolve` visible | `card.locator('.assets-cell orc-error-resolve')` count > 0 |
| 8. Empty — no keysets | `card.getByText('Balance Sheet', {exact: true})` visible | `card.locator('.balance-sheet-card')` count === 0 |
| 9. Loading | `card` mounted | same as state 8 — empty `.balance-sheet-card` set |
| 10a. desktop | `.balance-sheet-card .toggle-cell orc-mint-general-keyset` visible | inline keyset chip is in the right cell, not inside `.balance-sheet-details` |
| 10b. tablet | `card` mounted with `width: 768` viewport | `card.locator('.balance-sheet-card .toggle-cell orc-mint-general-keyset')` count === 0 (chip moved into expanded section); `orc-mint-general-balance-stacks` count === 0 |
| 10c. mobile | `card` mounted with `width: 375` viewport | same chip relocation as tablet; the `.balance-sheet-row` has class includes `'mobile'` via `[class.mobile]` binding on `.balance-sheet-list` |

`card` shorthand: `page.locator('orc-mint-general-balance-sheet').first()` — both `/` and `/mint` host one instance, but on `/mint` there can also be a sibling chart with class `chart-balance-sheet` (different selector — the card-component selector is unambiguous).

### Reusable interaction recipes

- **Click + assert expansion** — single click on `.balance-sheet-row`; wait for `.balance-sheet-details.animation-expanded` to appear. The toggle button has no own `(click)` handler — clicking it works only via row-level event bubbling, so prefer clicking `.balance-sheet-row` directly to avoid implicit dependence on Material's button event ordering.
- **Viewport switching for device variants** — `await page.setViewportSize({width: 768, height: 1024})` before navigation. Don't rely on Playwright `devices['iPhone 12']` because the layout service reads `BreakpointObserver` against media queries, not user agent; only viewport pixels matter.
- **Output emission check (Lightning-disabled row)** — Playwright cannot directly observe `(navigate)` — assert the post-click side effect: parent's `onNavigate('lightning')` triggers `router.navigate(['/lightning'])`, so `await expect(page).toHaveURL(/\/lightning$/)` after clicking `card.locator('.assets-cell button[mat-stroked-button]').first()`.
- **Numeric assertion against `localAmount` pipe** — the pipe writes inline HTML (`<span class="orc-amount">…</span>` etc.). Assert on the *visible text* of `.assets-cell .orc-amount` rather than parsing the wrapping spans; the unit lives separately in `.orc-unit` and is order-dependent (preceding glyph for `GLYPH` currency type, trailing code for `CODE`).

### Skip taxonomy

- State 3 (Oracle subcard): `fixture-only` — would require seeding a mock oracle price into Orchard's DB or wiring `BITCOIN_ORACLE_ENABLED=true` + a recorded price into a dedicated stack.
- State 4 (multi-row): `fixture-only` — `mintd.toml` / nutshell config would need to seed `usd` and `eur` keysets at boot. No current stack does.
- State 5 (Lightning disabled): `fixture-only` — would need a fifth stack with `LIGHTNING_ENABLED=false`. Cheap to add but currently absent.
- State 6 (Lightning loading): `unit-better` — assertable on a unit-test fixture far more reliably than chasing a millisecond of paint state in Playwright.
- State 7 (Lightning errors): `disruptive` — `docker pause lnd-orchard` would surface real errors but breaks every other LN-touching spec running against the same stack. Defer until a destructive-tier project is added.
- State 8 (Empty — no keysets): `fixture-only` — both nutshell and cdk-mintd auto-generate a `sat` keyset on first boot; reproducing the empty case requires a recorded fixture or a fresh mint state.
- State 9 (Loading): `unit-better` — same race issue as state 6.
- States 10b/10c (tablet/mobile): testable via viewport in a single project; no skip needed if a test loops through viewports.
- Child Stacks states (balanced / liabilities-heavy / reserve `< 1` / both-zero): `fixture-only` for the asymmetric states; `unit-better` for the size-1 edge case.

## Test fidelity hooks

No `mint-general-balance-sheet.spec.ts` exists yet. The Karma unit spec [`mint-general-balance-sheet.component.spec.ts`](../../src/client/modules/mint/modules/mint-general/components/mint-general-balance-sheet/mint-general-balance-sheet.component.spec.ts) only asserts `should create` against an empty input set — it does not exercise any of the rendered branches.

When writing `e2e/specs/mint-general-balance-sheet.spec.ts`, cover at minimum:

- state 1 (live, single bitcoin row): card title "Balance Sheet" visible, exactly one `.balance-sheet-card`, "Lightning local capacity" sublabel visible, "Unspent ecash" sublabel visible, inline keyset chip visible on desktop
- state 2 (expand): click row → `.balance-sheet-details.animation-expanded` appears with three `.orc-high-card` tiles (`Mint unit`, `Liability coverage`, `Fee revenue`), no `.orc-primary-card`
- state 10a (desktop): inline keyset chip is inside `.toggle-cell`, the Visual cell `orc-mint-general-balance-stacks` is mounted
- state 10b (tablet, viewport-switched): keyset chip absent from `.toggle-cell`; reappears inside `.balance-sheet-details` after expand; Visual cell unmounted

States NOT covered, with skip-taxonomy tags:

- state 3 (Oracle subcard) — `fixture-only`: needs `BITCOIN_ORACLE_ENABLED=true` + recorded price in a dedicated stack
- state 4 (multi-row) — `fixture-only`: needs `usd`/`eur` keysets seeded at boot
- state 5 (Lightning disabled) — `fixture-only`: needs `LIGHTNING_ENABLED=false` stack
- state 6 (Lightning loading) — `unit-better`: race-prone in Playwright; covered better in Karma
- state 7 (Lightning errors) — `disruptive`: `docker pause`-style; defer to a destructive tier
- state 8 (no keysets) — `fixture-only`: both mints auto-generate sat keyset on boot
- state 9 (`loading=true`) — `unit-better`: transient; cover in Karma
- state 10c (mobile viewport) — testable via `page.setViewportSize({width: 375, height: 812})`; only skip if the e2e project list doesn't include mobile (it doesn't today).

Child-component states skipped at the e2e level:

- `orc-mint-general-balance-stacks` reserve `< 1` (insolvent) — `fixture-only`; would need the mint to over-issue ecash relative to LN local capacity, which the regtest fund-topology never sets up
- `orc-mint-general-balance-stacks` `coin-unknown` glyph — `dead-branch`-ish: only triggers on `unit_mint` ∉ `{sat, usd, eur}`. `btc` and `msat` are theoretically reachable but no fixture emits them
- `orc-mint-general-keyset` `input_fee_ppk === 0` (no ppk label) — `fixture-only`; both regtest mints currently default to `100 ppk`. Cover in Karma if needed

## Notes for implementers

- `OnPush` with signal inputs but no `computed()` rebuild — the `rows()` recompute is bound to `ngOnChanges`, not to a reactive graph. That means changing `keysets()` or `balances()` *without* a corresponding change in `loading` / `lightning_balance` / `bitcoin_oracle_price` will NOT re-render rows. The current parent dashboards always update at least one of those three on every poll, so this hasn't bitten — but a future caller passing only updated `balances()` will see stale rows.
- The `ngOnChanges` re-init guards on `firstChange` for `lightning_balance` and `bitcoin_oracle_price` but not for `loading`. The intent is "only rebuild when the value flips from null to non-null"; a future change that makes `loading` settable to `false` more than once will retrigger `init()` each time.
- The keyset-merging logic in `getRows` keeps the *highest*-`derivation_path_index` keyset's chip (`active`, `input_fee_ppk`, `derivation_path_index`) and accumulates lower-index keysets into liability/fee totals. If keyset rotation ships a new keyset with a *lower* derivation path than expected (operator manually rolling back), the visible chip would lag the operator's mental model.
- The row-level click handler is on the `.balance-sheet-row` (the matRipple host) and bubbles up from any descendant — including the expanded panel's interior cards. Clicking inside the expanded section therefore collapses it, which makes text selection inside the expanded panel impossible without first detaching the click handler.
- The "Lightning Configuration" button branch is the only path that emits `(navigate)`. It does NOT pass an event payload — both parents respond by routing to `/lightning` with no further parameterisation. Adding additional navigate destinations here will require a payload type and parent updates.
- The component declares no internal subscriptions and overrides no lifecycle besides `ngOnChanges` — no `ngOnDestroy` cleanup is required.
