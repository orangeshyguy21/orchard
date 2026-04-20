# `orc-bitcoin-general-wallet-summary`

Source: [bitcoin-general-wallet-summary.component.ts](../../src/client/modules/bitcoin/modules/bitcoin-general/components/bitcoin-general-wallet-summary/bitcoin-general-wallet-summary.component.ts) · [`.html`](../../src/client/modules/bitcoin/modules/bitcoin-general/components/bitcoin-general-wallet-summary/bitcoin-general-wallet-summary.component.html)

## Purpose

The **Hot Wallet** tile on the dashboard (`/`). Flattens the on-chain balance held by the configured Lightning backend plus any Taproot Assets UTXOs into a single expandable card list. It is a pure presentational container — no service calls, no subscriptions — and derives its rows once in `ngOnInit` from the inputs it's handed. Each row exposes a collapsed summary (amount + UTXO count glyph) and, when clicked, an expanded panel with UTXO size histogram, asset metadata (for taproot assets), and the current USD oracle conversion (for bitcoin, when the oracle feature is on).

## Where it renders

- **Only usage**: [`orc-index-subsection-dashboard-bitcoin-enabled`](../../src/client/modules/index/modules/index-subsection-dashboard/components/index-subsection-dashboard-bitcoin-enabled/index-subsection-dashboard-bitcoin-enabled.component.html:29) on the dashboard, centre tile of the Bitcoin row between the Info card and the blockchain/syncing card.
- Only mounted when `enabled_bitcoin` is true in runtime config AND the parent dashboard has finished loading (`!loading()`). The component itself does not check `enabled_bitcoin`; the parent gates it.

## Inputs

| Input | Type | Required | Notes |
|---|---|---|---|
| `enabled_lightning` | `boolean` | ✓ | Runtime config flag. When false, no bitcoin row is produced. |
| `enabled_taproot_assets` | `boolean` | ✓ | Runtime config flag. When false, no taproot asset rows are produced. |
| `enabled_oracle` | `boolean` | ✓ | Runtime config flag. Gates the USD oracle card inside the expanded bitcoin row, and gates whether `amount_oracle` gets computed at all. |
| `bitcoin_oracle_price` | `BitcoinOraclePrice \| null` | ✓ | Latest oracle price (USD per BTC) fed from the parent's oracle query. Null when oracle is off or the query hasn't resolved. |
| `errors_lightning` | `OrchardError[]` | ✓ | From the parent's `errors_lightning` aggregate. Any non-empty array flips the bitcoin row into error mode and zeroes its amount + utxos. |
| `errors_taproot_assets` | `OrchardError[]` | ✓ | Same idea for taproot assets. Each tapd-sourced row inherits `error: true` if this array is non-empty. |
| `lightning_accounts` | `LightningAccount[]` | ✓ | Source of the on-chain Lightning balance. Rows flatten `accounts.flatMap(a => a.addresses)` and sum `.balance`. |
| `taproot_assets` | `TaprootAssets` | ✓ | Wrapper with `.assets: TaprootAsset[]`. Grouped by `asset_group.tweaked_group_key` or `asset_genesis.asset_id` (ungrouped assets fall back to the genesis id). |

## Outputs & projected content

- No `@Output()`s.
- No `<ng-content>` slot — the component renders a closed structure; no parent projection.

## Derived / computed signals

Note: `rows` and `expanded` are **plain `signal`s**, not `computed()`. They are seeded in `ngOnInit` and only mutated by the component's own `toggleExpanded()` method; input changes after mount do not retrigger the seeding.

- `rows: signal<TableRow[]>` — seeded once by `init()`. Contents:
  - If `enabled_lightning` → prepend one `TableRowBitcoin` with `unit: 'sat'`, amount = Σ `account.addresses[*].balance`, `utxos` = count of addresses with `balance > 0`, `utxo_sizes` = those balances. If `errors_lightning.length > 0`, the row carries `error: true` and amount/utxos fall to zero (the getters early-return on error).
  - If `enabled_taproot_assets` → one row per group key (falling back to `asset_genesis.asset_id` when there's no group). Amounts are scaled by `10^decimal_display` before summing; `utxos` is the number of asset entries folded into the group; `utxo_sizes` is the list of per-entry amounts; `error: true` mirrors `errors_taproot_assets.length > 0`.
  - Oracle price for the bitcoin row: `oracleConvertToUSDCents(amount, price, 'sat')` (USD cents, rounded). Null when `enabled_oracle` is false or `bitcoin_oracle_price` is null.
- `expanded: signal<Record<string, boolean>>` — keyed by row `unit` string. `toggleExpanded(unit)` inverts the flag. Seeded to `{}` (all collapsed).

## Happy path

1. Parent mounts this inside `@if (!loading())`; inputs are fully populated on first render.
2. `ngOnInit` runs `init()`, which reads all relevant input signals once and pushes rows in order: bitcoin (if lightning enabled) → taproot assets (if tapd enabled).
3. Each row renders as an outlined `mat-card` in a 3-column subgrid: asset glyph + amount on the left, `orc-bitcoin-general-utxo-stack` in the middle, a `keyboard_arrow_down` button on the right. The whole row is clickable (`matRipple`, `cursor-pointer`).
4. Click the row → `toggleExpanded(row.unit)` flips the entry in `expanded`; the `orc-animation-expand-collapse` div inside the card reveals the details.
5. Expanded details: a UTXO-count card with `orc-chart-graphic-bars` plotted behind it at 33% opacity (absolute-positioned, bottom-right anchored). For taproot assets, a sibling metadata card shows `group_key | dataTruncate: 12 : 6 : 6`, asset type, and asset version. For the bitcoin row with oracle enabled, an Oracle card shows the USD value plus the price's UTC date.

## Reachable states

### 1. Lightning only, collapsed (live)

Current `lnd-nutshell-sqlite` regtest state. `enabled_lightning=true`, `enabled_taproot_assets=false`, `enabled_oracle=false`.

- One bitcoin row: `₿ 989,995,882` sat glyph + amount; UTXO stack glyph on the right; down-caret.
- No taproot asset rows.
- No oracle card.

### 2. Lightning only, expanded (live)

Same inputs, after clicking the row.

- Caret flips up (`animation-expanded` CSS class applied).
- Below the divider: `1 / UTXO` card with the `orc-chart-graphic-bars` behind it at 33% opacity (one bar for the single 989,995,882 sat UTXO).

### 3. Lightning + oracle, expanded

`enabled_oracle=true`, `bitcoin_oracle_price={date:1713571200, price:64000}`, one UTXO of 989,995,882 sat split to 3 UTXOs for the chart demo.

- UTXO card shows `3 / UTXOs` (plural label kicks in for >1).
- New Oracle card below with the `orc-graphic-oracle-icon`, the header `Oracle` + `Price for Apr 20, 2024 UTC`, and a body showing `$ 633,597.36 / Hot wallet value`.
- The USD amount comes from `oracleConvertToUSDCents` → `localAmount: 'usd'` pipe formats cents to dollars.

### 4. Taproot asset row with group_key (expanded)

`enabled_taproot_assets=true`, one asset with `asset_group.tweaked_group_key='03abcdef…'` (64 hex), `asset_type='NORMAL'`, `version='ASSET_VERSION_V0'`, `decimal_display=6`, amount 10,000 (already descaled). Two UTXOs.

- Row header: question-mark-style graphic (from `orc-graphic-asset` — no custom icon registered for arbitrary asset names), `10,000 USDT` amount.
- Expanded: `2 / UTXOs` card + sibling metadata card showing `03abcd…567890 / Group key`, `NORMAL / Asset type`, `ASSET_VERSION_V0 / Asset version`. Group key is truncated via `dataTruncate: 12 : 6 : 6` — 6 leading + ellipsis + 6 trailing chars.

### 5. Taproot asset row without group_key (expanded)

Same, but `group_key: undefined` (a solo-issued asset using only `asset_genesis.asset_id` as its key).

- Header identical. Metadata card swaps the truncated key for a `check_indeterminate_small` mat-icon (a faint em-dash) under the "Group key" label — the `@if (row.group_key)` branch falls through to the else.

### 6. Lightning error

`errors_lightning.length > 0`. The bitcoin row replaces its entire left-side content with the `wallet-summary-error` slot: `orc-error-resolve [error]="errors_lightning()[0]" mode="small"` — rendered as a red `UNKNOWN ERROR / LIGHTNING_ERROR` chip on the collapsed row. The expand caret is still visible and the expand panel still renders (just with 0 UTXOs and an empty chart) if clicked.

### 7. Taproot assets error

`errors_taproot_assets.length > 0`. Every taproot asset row inherits `error: true` and renders the same red error chip, wired to `errors_taproot_assets()[0]` via `orc-error-resolve`. Bitcoin row is unaffected and renders normally.

### 8. Empty / disabled

Both `enabled_lightning=false` and `enabled_taproot_assets=false` (or enabled but no data — `lightning_accounts=[]` + `taproot_assets={assets:[]}`). The "Hot Wallet" title still renders, but the card list below it is empty (no `mat-card` nodes emitted because `rows` is `[]`). This leaves visible whitespace in the parent layout.

### 9. Multiple rows

Bitcoin + 2+ taproot asset rows together. Each row's expanded state is independent (keyed by `unit`), but note the **unit collision caveat** in edge cases below.

## Unhappy / edge cases

- **Input changes after mount**: `init()` only runs in `ngOnInit`. If the parent updates `lightning_accounts`, `taproot_assets`, `errors_*`, or oracle inputs after first render, `rows` will NOT re-seed. Today the parent's queries run once on load and aren't polled into this component, so this is not observed — but any future refactor that pipes live subscriptions in will silently stick on the first-resolved snapshot.
- **Row tracking by `unit`**: `@for (row of rows(); track row.unit)`. Units are not guaranteed unique — a Taproot asset whose `asset_genesis.name` is `sat` would collide with the bitcoin row; two asset groups sharing a name collide with each other. Collisions break Angular's row identity and also share `expanded[unit]` state.
- **`amount_oracle` rounding**: `oracleConvertToUSDCents(amount, price, 'sat')` returns integer USD cents via `Math.round`. Sub-penny truncation can shift the displayed value by up to $0.005.
- **Decimal-display of 0 or missing**: `asset.decimal_display?.decimal_display || 0` treats a missing decimal_display as 0 (no descaling). A tapd genesis with a real `decimal_display: 0` and one that has no decimal_display at all render identically.
- **Expand panel on error rows**: the `channel-details` div lives outside the error/else branches — clicking the caret on an error row still expands a UTXO card showing `0 / UTXOs` with no chart bars. Visually valid but not useful.
- **Empty UTXO list on bitcoin row**: `lightning_accounts` with all-zero-balance addresses yields `utxos: 0`, `utxo_sizes: []`. Row renders `₿ 0` amount, `0 / UTXOs` when expanded, empty chart.
- **Ungrouped taproot assets with the same `asset_id`**: the grouping key falls back to `asset_genesis.asset_id` — duplicate ids (should never happen per tapd semantics) would collapse into one row with the first asset's metadata winning.
- **Very long asset names**: the unit is rendered as `10,000 USDT` via `localAmount: row.unit : 'bitcoin'`. For long names there's no truncation; long units may wrap or push the caret column.

## Template structure (at a glance)

```
.flex-column
├── "Hot Wallet" title
└── .wallet-summary-list  (3-column subgrid: auto 1fr auto)
    └── @for row of rows()
        └── mat-card (outlined)
            └── mat-card-content  (grid subgrid, clickable, matRipple)
                ├── @if row.error
                │   └── orc-error-resolve [error]="errors_lightning/tapd[0]" mode="small"
                ├── @else
                │   ├── orc-graphic-asset [unit][height][custody="hot"][group_key?]
                │   ├── span [innerHTML]="row.amount | localAmount: row.unit : 'bitcoin'"
                │   └── orc-bitcoin-general-utxo-stack [unit][coins][group_key?]
                ├── button (keyboard_arrow_down, animation-rotate-toggle)
                └── .channel-details (animation-expand-collapse)
                    ├── UTXO count card + orc-chart-graphic-bars behind
                    ├── @if row.type === 'taproot_assets'
                    │   └── metadata card: group_key / asset_type / asset_version
                    └── @if row.type === 'bitcoin' && enabled_oracle()
                        └── Oracle card: date + USD value
```

## Interaction summary

| Gesture | Target | Result |
|---|---|---|
| click card row | `mat-card-content` (click handler) | `toggleExpanded(row.unit)` — flips the row's entry in `expanded` |
| click caret button | `button` with `tabindex="-1"` | bubbles up to the card's click; identical to clicking the row |
| hover row | `matRipple` on `mat-card-content` | Material ripple — no state change |
| click `orc-error-resolve` chip | inner to error component | opens the error-resolve flow (owned by `orc-error-resolve`, not this component) |

## Test fidelity hooks

The existing test file [`bitcoin-general-wallet-summary.component.spec.ts`](../../src/client/modules/bitcoin/modules/bitcoin-general/components/bitcoin-general-wallet-summary/bitcoin-general-wallet-summary.component.spec.ts) is a minimal Karma smoke test only — it instantiates the component with all feature flags off, empty arrays, and asserts `truthy`. No behavioural assertions exist today. There is no e2e spec colocated with this markdown (`bitcoin-general-wallet-summary.spec.ts` is absent).

States worth covering in a future e2e spec:

- Bitcoin-only row present when `enabled_lightning=true` on `lnd-nutshell-sqlite` (differential: amount matches `lncli walletbalance`).
- Expand/collapse toggle drives the `animation-expanded` class on both the caret and the details panel.
- Oracle card appears only when `enabled_oracle=true` AND `bitcoin_oracle_price != null` AND the row type is bitcoin.
- Taproot asset rows grouped correctly on `lnd-cdk-sqlite` (tapd-enabled stack): one row per `tweaked_group_key`, summed amount across UTXOs, `utxos` count matches tapd's asset list length for that group.
- Error-mode rendering: pause `lnd-orchard` (or `tapd-orchard`), confirm the row collapses to the red error chip, amount/utxo glyph hidden.
- Unit-collision regression guard: synthetic asset named `sat` should not merge into the bitcoin row (currently would).

## Notes for implementers

- `OnPush` with signal inputs — re-render fires on input signal identity change, but `rows` only re-seeds in `ngOnInit`, so CD alone won't pick up live data updates. If you need live rows, convert `rows` to a `computed()` and let it re-derive from the input signals directly.
- `expanded` is a record keyed on `unit` strings. Consider keying on a stable `row_id` (group_key || asset_id || 'sat') once `unit` collisions become possible — they will, the moment someone issues a tapd asset named `sat`.
- The UTXO sizes chart is absolutely positioned over the right half of the count card at 33% opacity. Any future redesign of the count card needs to preserve the `utxo-sizes-chart` anchor rules in [the SCSS file](../../src/client/modules/bitcoin/modules/bitcoin-general/components/bitcoin-general-wallet-summary/bitcoin-general-wallet-summary.component.scss:30).
- No subscriptions; no `ngOnDestroy` needed.
- No constructor body beyond the implicit one — all DI happens on field initializers via `inject()` (none required here).
