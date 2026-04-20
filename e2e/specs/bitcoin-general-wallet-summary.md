# `orc-bitcoin-general-wallet-summary`

Source: [bitcoin-general-wallet-summary.component.ts](../../src/client/modules/bitcoin/modules/bitcoin-general/components/bitcoin-general-wallet-summary/bitcoin-general-wallet-summary.component.ts) · [`.html`](../../src/client/modules/bitcoin/modules/bitcoin-general/components/bitcoin-general-wallet-summary/bitcoin-general-wallet-summary.component.html)

## Purpose

The **Hot Wallet** tile on the dashboard (`/`). Flattens the on-chain balance held by the configured Lightning backend plus any Taproot Asset UTXOs into a single expandable card list. It is a pure presentational container — no service calls, no subscriptions — and derives its rows once in `ngOnInit` from the inputs it is handed. Each row shows a collapsed summary (asset glyph + amount + UTXO count glyph) and, when clicked, expands into a UTXO-size histogram plus, for taproot assets, an asset metadata card, and, for bitcoin when the oracle feature is on, a USD conversion card.

## Where it renders

- **Only usage**: [`orc-index-subsection-dashboard-bitcoin-enabled`](../../src/client/modules/index/modules/index-subsection-dashboard/components/index-subsection-dashboard-bitcoin-enabled/index-subsection-dashboard-bitcoin-enabled.component.html) on the dashboard, centre tile of the Bitcoin row between the Info card and the blockchain/syncing card.
- Mounted only when `enabled_bitcoin` is true in runtime config and the parent dashboard has finished loading (`!loading()`). The component itself does not re-check feature flags; the parent gates it.

## Inputs

| Input | Type | Required | Notes |
|---|---|---|---|
| `enabled_lightning` | `boolean` | ✓ | Runtime config flag. When false, no bitcoin row is produced. |
| `enabled_taproot_assets` | `boolean` | ✓ | Runtime config flag. When false, no taproot asset rows are produced. |
| `enabled_oracle` | `boolean` | ✓ | Runtime config flag. Gates the USD oracle card inside the expanded bitcoin row; when false, `amount_oracle` stays null. |
| `bitcoin_oracle_price` | `BitcoinOraclePrice \| null` | ✓ | Latest oracle price. Null when oracle is off or the query has not resolved. |
| `errors_lightning` | `OrchardError[]` | ✓ | From the parent's `errors_lightning` aggregate. Non-empty flips the bitcoin row into error mode and zeroes its amount + UTXOs. |
| `errors_taproot_assets` | `OrchardError[]` | ✓ | Same idea for taproot assets — every tapd-sourced row inherits `error: true` if non-empty. |
| `lightning_accounts` | `LightningAccount[]` | ✓ | Source of the on-chain balance. Rows flatten `accounts.flatMap(a => a.addresses)` and sum `.balance`. |
| `taproot_assets` | `TaprootAssets` | ✓ | Wrapper with `.assets: TaprootAsset[]`. Grouped by `asset_group.tweaked_group_key` (or `asset_genesis.asset_id` as fallback). |

## Outputs & projected content

- No `@Output()`s.
- No `<ng-content>` slot.

## Derived / computed signals

Note: `rows` and `expanded` are plain `signal`s, not `computed()`s. They are seeded once in `ngOnInit` and only mutated afterwards by `toggleExpanded()`. Live input updates after first render do **not** re-seed the list.

- `rows: signal<TableRow[]>` — seeded by `init()`:
  - If `enabled_lightning` is true → pushes one `TableRowBitcoin` with `unit: 'sat'`, `amount` = Σ `account.addresses[*].balance`, `utxos` = count of addresses with `balance > 0`, `utxo_sizes` = those balances. If `errors_lightning.length > 0`, the row carries `error: true` and the amount/utxo getters early-return zero/empty.
  - If `enabled_taproot_assets` is true → one row per `asset_group.tweaked_group_key || asset_genesis.asset_id`. Each asset's `amount` is descaled by `10^decimal_display` before summing. `utxos` = count of source assets folded into the group, `utxo_sizes` = their per-asset amounts. `error: true` mirrors `errors_taproot_assets.length > 0`.
  - Oracle price for the bitcoin row: `oracleConvertToUSDCents(amount, price, 'sat')` (USD cents, rounded). Null when `enabled_oracle` is false or `bitcoin_oracle_price` is null.
- `expanded: signal<Record<string, boolean>>` — keyed by row `unit` string. `toggleExpanded(unit)` inverts the flag. Seeded to `{}` (all collapsed).

## Happy path

1. Parent mounts this inside `@if (!loading())` — inputs are fully populated on first render.
2. `ngOnInit` calls `init()`, reading every input signal once and pushing rows in order: bitcoin (if LN enabled) → one taproot asset row per group.
3. Each row renders as an outlined `mat-card` in a 3-column subgrid: asset glyph + amount on the left, `orc-bitcoin-general-utxo-stack` in the middle, a `keyboard_arrow_down` button on the right. The whole row is clickable (`matRipple`, `cursor-pointer`).
4. Click the row → `toggleExpanded(row.unit)` flips the entry in `expanded`; the `orc-animation-expand-collapse` div inside the card reveals the detail panel.
5. Expanded detail: a UTXO-count card with an `orc-chart-graphic-bars` plotted behind it at 33% opacity. For taproot assets, a sibling metadata card shows `group_key | dataTruncate: 12 : 6 : 6` (or an em-dash icon if ungrouped), asset type, asset version. For the bitcoin row with the oracle enabled, an Oracle card below shows the USD value plus the price's UTC date.

## DOM selectors (verified against the live preview)

These are the stable hooks for e2e assertions. **Angular property bindings (`[unit]`, `[height]`, `[custody]`, `[group_key]`) are NOT reflected as DOM attributes** — never key selectors off them.

| Thing | Selector | Produced by |
|---|---|---|
| The whole tile | `orc-bitcoin-general-wallet-summary` | The component selector. |
| A row (collapsed container) | `orc-bitcoin-general-wallet-summary .wallet-summary-card` | `mat-card.wallet-summary-card` in the template. |
| Row's clickable area | `.wallet-summary-row` (on `mat-card-content`) | Carries the `(click)` handler and `matRipple`. |
| Bitcoin-specific asset glyph | `.graphic-asset-btc` | `GraphicAssetComponent.unit_class()` returns `graphic-asset-btc` for `sat`/`msat`/`btc`. |
| Recognized tapd asset glyph (USDT) | `orc-graphic-asset img[src*="taproot-assets/"]` | `supported_taproot_asset()` → renders `<img src="taproot-assets/tether.svg">`. |
| Unrecognized tapd asset glyph | `.graphic-asset-unknown` | Fallback path for assets whose group_key is not in `config.constants.taproot_group_keys`. |
| Hot-wallet custody icon | `.graphic-asset-custody mat-icon` (text content `mode_heat`) | `custody='hot'` → `custody_icon()` returns `mode_heat`. |
| Row amount digits | `.orc-amount` (inside the clickable header, not the expanded panel) | Emitted by the `localAmount` pipe. For bitcoin: `<span class="orc-amount-preceding"><span class="orc-unit">₿</span><span class="orc-amount">989,992,032</span></span>`. For other units: amount first, unit appended after. |
| Expand caret | `button.orc-animation-rotate-toggle` | The `mat-icon-button` with `keyboard_arrow_down`. Toggled via the `animation-expanded` class. |
| Expanded detail panel | `.channel-details` | Toggled via `animation-expanded`. Always in the DOM; visibility is CSS-gated. |
| UTXO-count card (expanded) | `.channel-details .orc-high-card:first-child` | The first card inside the expanded panel. Count text in `.font-size-l`, label in `.font-size-xs`. |
| Taproot asset metadata card (expanded) | `.channel-details .orc-high-card:nth-child(2)` | Second card, only rendered for `row.type === 'taproot_assets'`. |
| Oracle card (expanded, bitcoin only) | `orc-graphic-oracle-icon` | Rendered inside `.channel-details` only when `enabled_oracle()` is true AND `row.type === 'bitcoin'`. |

## Reachable states

### 1. Bitcoin row only — collapsed (live on every stack)

Every e2e stack has LN enabled. On a healthy regtest wallet:

- One `mat-card` inside the tile.
- Glyph: `.graphic-asset-btc` with the `currency_bitcoin` mat-icon, custody icon `mode_heat`.
- Amount: `₿ <comma-separated sats>` — e.g. `989,992,032` on `lnd-cdk-sqlite` after the tapd mint anchor spent ~3,850 sats. Varies per stack.
- UTXO stack glyph on the right, `keyboard_arrow_down` caret.

### 2. Bitcoin row only — expanded (live on every stack)

- Caret + `.channel-details` gain `animation-expanded`.
- UTXO count card: `<n> UTXOs` (singular `UTXO` when n===1). On stacks where the fund script has the LN wallet hold one anchor output, n=1; once a tapd mint spends its own anchor, it typically becomes 2.

### 3. Bitcoin row + oracle expanded

Not reachable on regtest — there is no seeded oracle price. When `enabled_oracle=true` and `bitcoin_oracle_price` resolves, the expanded panel includes an `orc-graphic-oracle-icon` card with the formatted USD value (via `localAmount: 'usd'`) and the price's UTC date (via `timeUtc: 'date-only'`).

### 4. Taproot asset row (ungrouped, unrecognized) — live on `lnd-cdk-sqlite`

Seeded by the stack's `tapd-setup` compose service, which runs [`e2e/docker/scripts/fund-tapd.sh`](../docker/scripts/fund-tapd.sh) at bring-up and mints `TESTASSET` (100,000 units at `decimal_display: 2`, `asset_type: NORMAL`, no group key). The script is idempotent (re-runs just verify the asset exists) and `cdk-mintd` + `orchard` depend on its completion so the row is always present by the time the UI loads.

- Row 2 appears; total `.wallet-summary-card` count = 2.
- Glyph: `.graphic-asset-unknown` (the asset name is not in `taproot_group_keys`), with `question_mark` mat-icon.
- Amount: `1,000` followed by the asset name `TESTASSET` (non-bitcoin units render amount-then-unit, the opposite of bitcoin).
- Expanded metadata card: "Group key" section shows the `check_indeterminate_small` em-dash icon (ungrouped fallback), "Asset type" shows `NORMAL`, "Asset version" shows `ASSET_VERSION_V0`.

### 5. Taproot asset row (grouped) — synthetic

Not exercised live — would require minting with `--new_grouped_asset` or `--group_anchor`. Expected rendering: the group-key em-dash is replaced by `tweaked_group_key | dataTruncate: 12 : 6 : 6` (first 6 + ellipsis + last 6 hex chars). Rest of the card identical.

### 6. Recognized taproot asset (USDT) — synthetic

Not exercised live — would require a mint whose `tweaked_group_key` equals `config.constants.taproot_group_keys.usdt` (a specific 66-hex key; regtest cannot reproduce mainnet's USDT group). Expected rendering: the glyph div is replaced by `<img src="taproot-assets/tether.svg">` sized to `height()`.

### 7. Lightning error

`errors_lightning.length > 0`. The bitcoin row's collapsed left side is replaced by `<orc-error-resolve [error]="errors_lightning()[0]" mode="small">` — a red chip. The caret still renders and the expanded panel still opens (showing 0 UTXOs with an empty chart). Not exercised in e2e (would require pausing `lnd-orchard`, which would break sibling specs).

### 8. Taproot assets error

`errors_taproot_assets.length > 0`. Every tapd row inherits `error: true` and renders `<orc-error-resolve [error]="errors_taproot_assets()[0]" mode="small">`. Bitcoin row unaffected. Not exercised in e2e for the same reason as state 7.

### 9. Empty / disabled

`enabled_lightning=false` AND `enabled_taproot_assets=false`, or both enabled but `lightning_accounts=[]` + `taproot_assets={assets:[]}`. The "Hot Wallet" title still renders; the card list below is empty. Not observed on any current stack (all four ship with LN enabled).

### 10. Multiple rows — mixed

Bitcoin + ≥1 taproot asset. Each row's expanded state is independent (keyed by `unit`), but note the collision caveat under Unhappy cases.

## Unhappy / edge cases

- **Input changes after mount are ignored.** `init()` only runs in `ngOnInit`. If the parent later refreshes `lightning_accounts`, `taproot_assets`, `errors_*`, or oracle inputs, `rows` will NOT re-seed. Today the parent's dashboard queries resolve before mount and don't stream into this component, so this is invisible — but any refactor that feeds live subscriptions will silently stick on the first snapshot.
- **Row tracking by `unit` is unsafe under collision.** `@for (row of rows(); track row.unit)`. A tapd asset whose `asset_genesis.name` is `sat` collides with the bitcoin row's unit — breaking Angular's row identity *and* sharing `expanded[unit]` state. Similarly, two asset groups sharing `asset_genesis.name` share a unit.
- **`asset.decimal_display` optional chain treats missing as 0.** `asset.decimal_display?.decimal_display || 0` means a tapd genesis with an explicit `decimal_display: 0` and one with no `decimal_display` at all render identically.
- **Expand panel on error rows is a dead UI.** The `.channel-details` div lives outside the error/else branches — clicking the caret on an error row still expands a UTXO card showing `0 UTXOs` with no chart bars.
- **Ungrouped assets use `asset_genesis.asset_id` as the grouping key.** Duplicate asset_ids (shouldn't happen per tapd semantics) would collapse into one row with the first asset's metadata winning.
- **Long unit names push the caret column.** No truncation on the amount/unit span — a very long tapd asset name wraps or overflows into the utxo-stack column.

## Template structure (at a glance)

```
.flex-column
├── "Hot Wallet" title
└── .wallet-summary-list  (3-column subgrid: auto 1fr auto)
    └── @for row of rows()
        └── mat-card.wallet-summary-card (outlined)
            └── mat-card-content.wallet-summary-row (click, matRipple)
                ├── @if row.error
                │   └── orc-error-resolve [error]="errors_lightning/tapd[0]" mode="small"
                ├── @else
                │   ├── orc-graphic-asset [unit][height][custody="hot"][group_key?]
                │   ├── span.orc-amount  (inside the localAmount pipe output)
                │   └── orc-bitcoin-general-utxo-stack [unit][coins][group_key?]
                ├── button.orc-animation-rotate-toggle  (keyboard_arrow_down)
                └── .channel-details.orc-animation-expand-collapse
                    ├── .orc-high-card  (UTXO count + bars chart underlay)
                    ├── @if row.type === 'taproot_assets'
                    │   └── .orc-high-card  (group_key / asset_type / asset_version)
                    └── @if row.type === 'bitcoin' && enabled_oracle()
                        └── .orc-primary-card  (oracle: date + USD value)
```

## Interaction summary

| Gesture | Target | Result |
|---|---|---|
| click row | `mat-card-content.wallet-summary-row` | `toggleExpanded(row.unit)` — flips the row's entry in `expanded`; caret + details gain/lose `animation-expanded`. |
| click caret | `button.orc-animation-rotate-toggle` | Click bubbles to the row's handler — identical effect to clicking the row body. |
| hover row | `matRipple` | Material ripple animation only. No state change. |
| click error chip | inside `orc-error-resolve` | Delegates to the error-resolve component's flow — not owned by this component. |

## Test fidelity hooks

The co-located [`bitcoin-general-wallet-summary.spec.ts`](./bitcoin-general-wallet-summary.spec.ts) covers:

- **`@all`** (all four stacks, differential against the LN backend):
  - Hot Wallet title renders.
  - Bitcoin row's `.graphic-asset-btc` glyph is visible, with the `mode_heat` custody icon.
  - Bitcoin row amount equals `ln.onchainSats(config)`.
  - Expand toggle flips `animation-expanded` on caret and `.channel-details`.
  - Expanded UTXO count > 0 with a singular/plural label that tracks the digit.
  - Oracle card absent by default.
- **`@tapd`** (only `lnd-cdk-sqlite`):
  - `TESTASSET` is minted by the stack's `tapd-setup` container (via [`fund-tapd.sh`](../docker/scripts/fund-tapd.sh)) before Orchard boots — no in-test minting.
  - The spec reads the asset off tapd at assertion time via `tapcli` (differential source of truth for amount + version + asset_type).
  - Row count is 2 (bitcoin first, TESTASSET second).
  - Tapd row uses `.graphic-asset-unknown` (the asset name is not registered in `taproot_group_keys`).
  - Row amount equals `parseInt(tapd.amount) / 10^decimal_display`.
  - Expanded metadata card shows the em-dash group-key fallback, `NORMAL` asset type, `ASSET_VERSION_V0` version.

States still uncovered (deliberately, see Reachable states 3 / 5 / 6 / 7 / 8 / 9):

- Oracle card rendering (needs oracle seed on regtest).
- Grouped taproot asset rendering (needs `--new_grouped_asset` mint).
- USDT svg path (needs a group key matching `config.constants.taproot_group_keys.usdt`).
- Lightning / tapd error chips (needs `docker pause`, too disruptive for shared state).
- Empty/disabled tile (no stack ships with LN off).
- Unit-collision regression guard (would require a synthetic asset named `sat`).

The pre-existing Karma component smoke test [`bitcoin-general-wallet-summary.component.spec.ts`](../../src/client/modules/bitcoin/modules/bitcoin-general/components/bitcoin-general-wallet-summary/bitcoin-general-wallet-summary.component.spec.ts) only asserts the component instantiates with empty inputs — no behavioural coverage there.

## Notes for implementers

- `OnPush` with signal inputs — re-render fires on input signal identity change, but `rows` only re-seeds in `ngOnInit`, so change detection alone will not pick up live data updates. Converting `rows` to a `computed()` off the signal inputs is the fix if streaming updates become a requirement.
- `expanded` is a record keyed on `unit` strings. Consider re-keying on a stable `row_id` (`group_key || asset_id || 'sat'`) once `unit` collisions become realistic — they will the moment someone issues a tapd asset named `sat`.
- The UTXO-sizes chart is absolutely positioned over the right half of the count card at 33% opacity. Any redesign of the count card needs to preserve the `utxo-sizes-chart` anchor rules in [the SCSS file](../../src/client/modules/bitcoin/modules/bitcoin-general/components/bitcoin-general-wallet-summary/bitcoin-general-wallet-summary.component.scss).
- No subscriptions; no `ngOnDestroy` needed.
- `[unit]`/`[height]`/`[custody]`/`[group_key]` on `orc-graphic-asset` are Angular *property* bindings — they do not become DOM attributes. Any test or style hook keyed off attribute selectors (e.g. `[unit="sat"]`) will silently match nothing. Always use the rendered class names (`graphic-asset-btc` / `graphic-asset-unknown` / image src).
