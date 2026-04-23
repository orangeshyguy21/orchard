# `orc-lightning-general-channel-summary`

Source: [lightning-general-channel-summary.component.ts](../../src/client/modules/lightning/modules/lightning-general/components/lightning-general-channel-summary/lightning-general-channel-summary.component.ts) · [`.html`](../../src/client/modules/lightning/modules/lightning-general/components/lightning-general-channel-summary/lightning-general-channel-summary.component.html)

## Purpose

The **Channel Summary** card on the dashboard's Lightning row. It aggregates the operator's open + closed channels into one row per asset unit (sats always; one row per Taproot-asset group when tapass is enabled) and lets the operator toggle between "all open channels" and "only active channels". Each row expands to reveal per-row metrics: total / active / closed channel counts, average channel size, a capacity-distribution sparkline per count, and — for the sat row only, when the Bitcoin oracle is on — USD equivalents for total / local / remote capacity.

It is a pure presentational container — all data comes from inputs; no service calls, no subscriptions. The only mutating state it owns is the `summary_type` toggle and the per-row `expanded` map.

## Where it renders

- **Only usage**: [`orc-index-subsection-dashboard-lightning-enabled`](../../src/client/modules/index/modules/index-subsection-dashboard/components/index-subsection-dashboard-lightning-enabled/index-subsection-dashboard-lightning-enabled.component.html:24) on the dashboard (`/`), to the right of the Lightning `Info` card.
- Only mounted when `enabled_lightning` is true in runtime config AND the parent dashboard has finished loading (`!loading()`).

## Inputs

| Input | Type | Required | Notes |
|---|---|---|---|
| `lightning_info` | `LightningInfo \| null` | ✓ | From `lightningInfo` query. Currently unused by this component's render logic, but wired for future use and kept in the input surface. |
| `lightning_channels` | `LightningChannel[] \| null` | ✓ | From `lightningChannels` query. Open channels (active or inactive). `null` means "not yet loaded" — the sat row skips rendering until it resolves. |
| `lightning_closed_channels` | `LightningClosedChannel[] \| null` | ✓ | From `lightningClosedChannels` query. Feeds `channel_closed_count` and `channel_closed_sizes` per row. |
| `enabled_taproot_assets` | `boolean` | ✓ | Runtime feature flag. When `false`, tapass rows are never emitted regardless of channel contents. |
| `taproot_assets` | `TaprootAssets \| null` | ✓ | Input surface for future cross-reference; not read by render logic today (grouping key comes from `channel.asset.group_key` directly). |
| `bitcoin_oracle_enabled` | `boolean` | ✓ | Gates the USD-equivalent block inside the expanded bitcoin row. |
| `bitcoin_oracle_price` | `BitcoinOraclePrice \| null` | ✓ | `{date, price}` — `price` is USD-per-BTC. Used both as a multiplier for the oracle block and as the date label. |
| `device_type` | `'desktop' \| 'tablet' \| 'mobile'` | ✓ | Controls two things: the `.mobile` grid modifier on the list, and the `display_mode` (`'large'` vs `'small'`) passed into the inner `orc-lightning-general-channel` graphic. Tablet renders the same as mobile for grid purposes — only desktop gets the three-column subgrid. |

## Outputs & projected content

- No `@Output()`s.
- No `<ng-content>` slots. The card owns its full surface.

## Derived / computed signals

- `summaries` (private `signal<Record<string, ChannelSummary[]>>`, default `{open: [], active: []}`) — recomputed by an `effect()` that re-reads `lightning_channels`, `lightning_closed_channels`, `enabled_taproot_assets`, and `bitcoin_oracle_price`. Keyed by summary mode so the toggle is an O(1) lookup at render time.
- `summary_type` — `'open' | 'active'`, set by the menu. Drives which slot of `summaries()` the `rows` computed returns.
- `rows` = `summaries()[summary_type()]`. The array rendered by the `@for` in the template.
- `expanded` — `signal<Record<unit, boolean>>`. Each row's `unit` (`'sat'` or the asset `name`) maps to whether its details panel is open.

### How a row gets built

- **Sat row** (`getSatSummary(active)`): filters `lightning_channels` to non-asset (`!channel.asset`); if `null` returns `[]` (renders nothing). `summing_channels` is all open channels (`active=false` mode) or only `active=true` ones (`active=true` mode). `local`/`remote`/`size` are sums over `summing_channels`. `channel_count` == `summing_channels.length`. `channel_active_count` is always derived from `sat_channels.filter(active)` regardless of mode (so both modes see "X active of Y"). `channel_closed_count` uses the closed list. Emits a single row; if `local_balance === 0 && remote_balance === 0` the row is **suppressed** (empty `[]`).
- **Taproot rows** (`getTaprootAssetsSummaries(active)`): only runs when `enabled_taproot_assets === true`; returns `[]` if `lightning_channels` is null. Groups asset channels by `asset.group_key || asset.asset_id` — i.e. the group key if the asset is part of a fungible group, otherwise the single asset id. Units: each asset's `local_balance`/`remote_balance` is divided by `10^decimal_display` before summing (so the display number respects the asset's declared precision). Closed and active counts are added from the corresponding filtered lists, not from the grouping pass. One row per group.
- **Oracle conversion** (sat row only): `size_oracle` / `remote_oracle` / `local_oracle` are produced by `oracleConvertToUSDCents(amount, price, 'sat')` when `bitcoin_oracle_price.price` is truthy; otherwise `null`. Taproot rows always leave these `null` — there is no per-asset oracle today.

## Happy path

1. Parent mounts this inside `@if (!loading())`; both channel arrays are populated on first render.
2. Header row: **Channel Summary** title on the left, a menu-trigger button on the right showing "All channels" (default `summary_type === 'open'`).
3. One row per unit. Collapsed by default. For the regtest `lnd-nutshell-sqlite` fixture, this is a single `sat` row summing the two `alice↔orchard` / `orchard↔bob` channels (`₿ 20,000,000`, capacity evenly split local/remote).
4. Row header shows: asset icon (`orc-graphic-asset`) · big capacity number (`localAmount` pipe) · "Total {unit} capacity" sub-label · a flow graphic (`orc-lightning-general-channel`, large on desktop, small elsewhere) splitting local/remote · a rotate-on-expand chevron.
5. Clicking the row toggles `expanded[unit]`; the details region slides open (`orc-animation-expand-collapse` + rotation of the chevron via `animation-expanded`).
6. Details: four `orc-high-card`s — Channels / Active channels / Closed channels / Average channel size — each with a right-half `orc-chart-graphic-bars` sparkline rendering the matching `channel_*_sizes` array at 33% opacity. The average card has no chart.
7. If the row `is_bitcoin` AND `bitcoin_oracle_enabled()` is true, a fifth block renders below the four cards — an Oracle card with the snapshot date and three USD capacity figures (total / local / remote).
8. Clicking the menu-trigger opens a `mat-menu` with two items ("All channels" / "Active channels"); each item flips `summary_type.set(...)` and closes the menu. The currently-selected item shows a `check` icon + is highlighted with `active-summary-option`.

## Reachable states

### 1. Single sat row, collapsed — live on `lnd-nutshell-sqlite`

With the fixture's two channels (each 10 M sat capacity), the component renders one row: `₿ 20,000,000` / "Total sat capacity" / large flow graphic / chevron. `summary_type === 'open'`, label reads "All channels".

### 2. Single sat row, expanded

Click the row. Details reveal `2 Channels`, `2 Active channels`, `0 Closed channels`, `₿ 10,000,000 Average channel size`. Sparklines render two equal bars for the total + active charts; an empty plot for closed. The chevron rotates via `animation-expanded`.

### 3. Summary type toggle — "All channels" → "Active channels"

Open the menu, click "Active channels". `summary_type` becomes `'active'`, the label flips to "Active channels", and rows rebuild from the `active` slot: `channel_count` now counts only active channels. In the regtest fixture both channels are active, so the numbers are identical to state 1; but any inactive channel would drop out of the `channel_count` here while still counting in state 1.

### 4. Zero balances — row suppressed

If `local_balance === 0 && remote_balance === 0` across all open sat channels (e.g. a brand-new node with no opens yet, or all opens in pending state), the sat row is dropped from `summaries.open`. Combined with `enabled_taproot_assets === false`, `rows()` is `[]` and the list region renders empty (no fallback text, no card). Verified by overriding `summaries` to `{open: [], active: []}` — produces a headered-but-empty card.

### 5. Taproot asset row appears

When `enabled_taproot_assets === true` AND `lightning_channels` contains channels with `.asset`, one additional row appears per `group_key || asset_id`. Asset rows share the same card template as the sat row — icon, capacity (formatted via `localAmount` with the asset's unit), flow graphic keyed by `group_key`, expandable details. Oracle block never renders for asset rows (the `is_bitcoin` branch gates it). Verified by injecting two USDT channels sharing `group_key: 'gk_alpha'` into the summaries signal — rendered as `7,500 USDT` / "Total USDT capacity" / `2 Channels` in the expanded panel.

### 6. Bitcoin oracle block — enabled

Expand the sat row with `bitcoin_oracle_enabled === true` and `bitcoin_oracle_price` set. Below the four count cards, an `orc-primary-card` appears: header "Oracle" + "Price for {date} UTC" on the right; body three equal columns — "Total capacity" / "Local capacity" / "Remote capacity" — each showing a USD figure from the `*_oracle` cents value piped through `localAmount: 'usd'`. Verified live with a mock oracle price of 100,000 USD/BTC — card shows `$ 20,000,000` total.

### 7. Bitcoin oracle block — disabled

Expand the same row with `bitcoin_oracle_enabled === false` (or `true` but `bitcoin_oracle_price` null — `oracle_price?.price || null` short-circuits). The Oracle card is gone; expanded region ends at the four count cards. Taproot-asset rows look identical in both oracle states.

### 8. Mobile / tablet layout

`device_type() === 'mobile'` adds the `.mobile` class to `.channel-summary-list`, which:
- switches the grid from three-column subgrid to `display: flex; flex-direction: column` (stacks cards full-width).
- inside each row, regrids to `'info toggle' / 'channel channel'` — the flow graphic (`orc-lightning-general-channel`) drops onto its own row below the info + chevron. The inner graphic's `display_mode` also switches from `'large'` to `'small'` (tighter chip rendering).
- tablet hits only the flow-graphic `display_mode` switch via the ternary `device_type() === 'desktop' ? 'large' : 'small'`; the outer grid stays three-column. Confirmed live: on tablet (756px viewport) the card keeps the three-column subgrid but uses the small flow graphic.

### 9. Summary-type menu — open

Clicking the menu-trigger button opens a two-item menu rendered in the CDK overlay (outside the card). Both items always render; the current selection shows a `check` icon and the `active-summary-option` highlight. Verified: menu opens with `check All channels` + `Active channels` labels. Full enumeration of the menu as a child component lives under [Child components → `mat-menu`](#mat-menu-summary-type-selector).

## Child components

This card hosts several nested components, each with its own rendered state. The parent-owned `mat-menu` is the only *interaction-bearing* child; the rest are presentational graphics driven by the row data the parent builds.

### `mat-menu` (summary-type selector)

Defined inline at the bottom of the template ([lightning-general-channel-summary.component.html:158-167](../../src/client/modules/lightning/modules/lightning-general/components/lightning-general-channel-summary/lightning-general-channel-summary.component.html#L158)). Rendered in the CDK overlay container on trigger click, not inside the card.

- **Template ID**: `#channel_summary_menu`, positioned `yPosition="below" xPosition="before"`.
- **Items** (two, always both rendered):
  - `All channels` → click fires `summary_type.set('open')`.
  - `Active channels` → click fires `summary_type.set('active')`.
- **Currently-selected item** (template gate `summary_type() === 'open'` / `'active'`):
  - Button carries the CSS class `active-summary-option` (for styling highlight).
  - The `<mat-icon>` on the left renders `check`; on the unselected item the icon renders empty text (still present in the DOM, but with no glyph).
- **Close behaviour**: standard MatMenu — click any item fires its `(click)` and closes; click backdrop or `Esc` closes without mutating `summary_type`.
- **Data contract with parent**: none via inputs. The menu reads `summary_type()` directly inside its template bindings.

Verified live on the regtest fixture: opening the menu shows `check All channels` + `Active channels`; the second item has no leading glyph and no `active-summary-option` class.

### `orc-lightning-general-channel` (flow graphic)

Source: [lightning-general-channel.component.ts](../../src/client/modules/lightning/modules/lightning-general/components/lightning-general-channel/lightning-general-channel.component.ts). Presentational — no interactions, no outputs, no services beyond `ConfigService` for the taproot group-key lookup.

- **Inputs** (all driven by the row):
  - `size` — `string` default `'4rem'`, bound to the host `--ring-size` CSS var.
  - `display_mode` — `'large' | 'small'`; parent sets `'large'` when `device_type === 'desktop'`, else `'small'`. Controls the `truncated` computed (`small` ⇒ `true`).
  - `capacity`, `remote`, `local` — the row's sums.
  - `unit` — the row's unit string (`'sat'`, asset name).
  - `group_key` — optional; used for taproot-asset class matching.
- **Reachable states** (via the `channel_class` computed):
  - `unit === 'sat' | 'msat' | 'btc'` → `channel-btc` (orange/red split arcs — the sat row on every regtest fixture).
  - `group_key === constants.taproot_group_keys.usdt` → `channel-tether` (USDT-specific teal-green fill).
  - Anything else → `channel-unknown` (neutral grey split — the state the `TESTASSET` row lands in on `lnd-cdk-sqlite`).
- **Percentage bars**: `percentage_local` + `percentage_remote` compute `local / capacity * 100` and `remote / capacity * 100`. On the live regtest fixture both are ~50% (10,000,809 local / 9,992,251 remote out of 20,000,000 capacity — the small asymmetry is channel-funding fees paid by the opener).
- **Display mode difference**: `'large'` renders the full segment labels + numeric chips; `'small'` (`truncated: true`) drops the text labels to keep the graphic compact. The e2e preview on tablet (756px) sees `'small'`, as does mobile.

### `orc-graphic-asset` (per-row asset glyph)

Source: [graphic-asset.component.ts](../../src/client/modules/graphic/components/graphic-asset/graphic-asset.component.ts). Presentational.

- **Inputs**: `unit` (required), `height` (default `'2rem'`; parent passes `'2.5rem'`), `custody` (parent passes `'lightning'`), `group_key` (from the row).
- **Reachable states**:
  - `unit_class` computed: `graphic-asset-btc` for `sat/msat/btc`, `graphic-asset-usd`, `graphic-asset-eur`, or `graphic-asset-unknown` for anything else (including `TESTASSET`).
  - `unit_icon` computed: `currency_bitcoin` for `sat/msat/btc`, `attach_money` for `usd`, `euro` for `eur`, else `question_mark`.
  - `custody_icon`: always `bolt` when rendered by this parent (it passes `custody="lightning"`).
  - `supported_taproot_asset` / `taproot_asset_image`: true + image lookup for USDT (via `taproot_group_keys.usdt` config); false otherwise. Used to swap the inner glyph to the tether SVG when the asset matches.
- **No state transitions** — this component does not mutate; it re-renders when inputs change.

### `orc-chart-graphic-bars` (sparkline per count card)

Source: [chart-graphic-bars.component.ts](../../src/client/modules/chart/components/chart-graphic-bars/chart-graphic-bars.component.ts). Three instances per expanded row (Channels / Active / Closed; the Average card does NOT wrap one).

- **Input**: `bars: number[]`.
- **`relative_bars` computed**: sorts descending, normalises to `value / max * 100`. Empty-input edge case returns `[]` (no bars rendered — exactly what the Closed card shows on a fresh regtest stack).
- **Reachable states** (verified live on the regtest sat row, `channel_sizes = [10000000, 10000000]`):
  - populated: two bars at `100, 100` (max normalisation produces both at full height).
  - empty: zero bars (closed-channels sparkline on a fresh stack).
- **No interaction** — the overlay sparkline is rendered at 33% opacity behind the count glyphs; it's visual density, not data a user interacts with.

### `orc-high-card` · `orc-primary-card` · `orc-graphic-oracle-icon`

Pure layout wrappers / single-glyph components. Four `orc-high-card`s wrap the count tiles (Channels / Active / Closed / Average). The Oracle block wraps content in an `orc-primary-card` and uses `orc-graphic-oracle-icon` for its header glyph. None of these have reachable state branches worth enumerating; they are specced here for completeness because a future `@if`/`@else` on the wrappers would widen the state surface.

## Unhappy / edge cases

- **`lightning_channels === null`** — sat summary bails to `[]` (no sat row). Taproot branch also bails (checks `lightning_channels` before the asset filter). `rows()` returns `[]`. List region renders as an empty `<!--container-->` under the header.
- **`lightning_closed_channels === null`** — `channel_closed_count` defaults to `0`; `channel_closed_sizes` is `[]`. The "Closed channels" card and its sparkline render `0` + empty chart — no error, no null flash.
- **All open channels inactive** (`active === false` on every channel) — `summary_type === 'open'` still shows the row (balances are non-zero). `summary_type === 'active'` filters to empty → `local === 0 && remote === 0` → row suppressed → `rows()` empty in the active slot. Toggling back to "All channels" restores the row.
- **Taproot asset with `decimal_display === 0`** — divisor is `10^0 = 1`, so `local_balance + remote_balance` is used as-is. No rounding applied.
- **Mixed-decimal assets in one group** — shouldn't happen (same `group_key` implies same precision), but if it did, the reducer reads `decimal_display` off each channel's own asset — the displayed total could double-convert. Not defended against; upstream invariant is that group members share `decimal_display`.
- **Asset with no `group_key`** (solo asset, not part of a group) — falls back to `asset_id` as the grouping key; renders the asset name and icon just the same. Asset id is only visible to the `orc-graphic-asset` child via `[group_key]`, which handles the distinction internally.
- **`bitcoin_oracle_enabled === true` but `bitcoin_oracle_price === null`** — `oracle_price?.price || null` short-circuits; `size_oracle / local_oracle / remote_oracle` are all `null`. The template gate is `bitcoin_oracle_enabled()` not the oracle values, so the Oracle card still attempts to render — `null | localAmount: 'usd'` relies on the pipe's null handling, and the date line prints `"Price for UTC"` (no date). Worth knowing if the feature flag and the data race on first load.
- **Negative / NaN capacities** — summed blindly via `reduce`; `Math.round(size / channel_count)` on the average would propagate NaN. Upstream shouldn't emit those, but there is no defensive coercion.

## Template structure (at a glance)

```
.lightning-channel-table-container
├── header row
│   ├── "Channel Summary" title
│   └── .lightning-channel-summary-selector
│       └── button[matMenuTriggerFor=channel_summary_menu]
│           ├── graph_4 icon (rotated 90°)
│           └── "{All|Active} channels"
├── .channel-summary-list (+ .mobile variant)
│   └── @for row of rows() (track row.unit)
│       └── mat-card.channel-summary-card
│           └── mat-card-content.channel-summary-row  (click → toggleExpanded)
│               ├── info cluster: orc-graphic-asset + size + "Total {unit} capacity"
│               ├── orc-lightning-general-channel  (flow graphic, large|small)
│               ├── chevron button  (rotates on expand)
│               └── .channel-details  (expand/collapse)
│                   ├── 4 × orc-high-card: Channels / Active / Closed / Average
│                   │       (first three overlay an orc-chart-graphic-bars sparkline)
│                   └── @if (row.is_bitcoin && bitcoin_oracle_enabled())
│                       └── Oracle orc-primary-card
│                           ├── header: orc-graphic-oracle-icon + "Oracle" + date
│                           └── three USD cards: Total / Local / Remote
└── mat-menu#channel_summary_menu
    ├── "All channels" (summary_type.set('open'))
    └── "Active channels" (summary_type.set('active'))
```

## Interaction summary

| Gesture | Target | Result |
|---|---|---|
| click `.channel-summary-row` | `matRipple` surface, whole row | `toggleExpanded(row.unit)` — flips `expanded[unit]`, slides the details region open/closed, rotates the chevron |
| click chevron button | `mat-icon-button` inside the row | bubbles to the row's click (button has `tabindex="-1"`); toggles expand |
| click menu-trigger | `button[matMenuTriggerFor]` | opens `mat-menu` in the CDK overlay with two items |
| click "All channels" *(inside `mat-menu`)* | `mat-menu-item` | `summary_type.set('open')`, menu closes, label + rows rebuild, item gains `active-summary-option` + `check` icon |
| click "Active channels" *(inside `mat-menu`)* | `mat-menu-item` | `summary_type.set('active')`, menu closes, label + rows rebuild, item gains `active-summary-option` + `check` icon |
| click backdrop / `Esc` *(inside `mat-menu`)* | CDK overlay backdrop | menu closes without mutating `summary_type` |
| hover row | `matRipple` | ripple — no state change |

Nothing navigates.

## Test fidelity hooks

No dedicated e2e spec exists yet (the accompanying [`lightning-general-channel-summary.spec.ts`](./lightning-general-channel-summary.spec.ts) is a new file for this component). The existing karma unit spec at [`lightning-general-channel-summary.component.spec.ts`](../../src/client/modules/lightning/modules/lightning-general/components/lightning-general-channel-summary/lightning-general-channel-summary.component.spec.ts) only asserts `should create` with all inputs nulled.

States that an e2e spec should cover against the live `lnd-nutshell-sqlite` fixture:

- card renders with title "Channel Summary" and the menu-trigger label "All channels"
- one sat row exists with capacity equal to the sum of `lncli listchannels` capacities (differential)
- `channel_count` / `channel_active_count` / `channel_closed_count` in the expanded panel match `lncli listchannels` / `lncli closedchannels` counts (differential)
- menu toggle to "Active channels" updates both the trigger label and the row counts
- expand/collapse: clicking the row reveals the four count cards; clicking again hides them

States that need other stacks or synthetic fixtures to exercise:

- Oracle block rendering (`lnd-cdk-sqlite` with oracle enabled, or a mocked `bitcoin_oracle_price`)
- Taproot-asset rows (`lnd-cdk-sqlite` with asset channels opened — none in the current fixture)
- Zero-channel state (fresh node, no opens yet) — regtest fixture always has two
- Inactive-channel divergence between "All" and "Active" modes (needs a channel that's open but inactive)

## Notes for implementers

- OnPush + signal inputs: the `summaries` signal is recomputed inside an `effect()` that reads `lightning_channels()`, `lightning_closed_channels()`, `enabled_taproot_assets()`, and `bitcoin_oracle_price()`. The effect runs every time any of those inputs change reference; if a parent passes fresh array instances on every poll (the default behaviour of the GraphQL cache for list results), this rebuilds both `open` and `active` summaries on every tick. Cheap for a handful of channels; would be worth memoising if channel counts grow into the hundreds.
- The `effect()` is used instead of a `computed()` because `summaries` holds a precomputed shape keyed by summary mode — `rows()` reads from it by index. If this ever becomes a source of stale reads (an input changes but the effect hasn't flushed), switch to `computed()`s per mode.
- `expanded` is a `Record<string, boolean>` keyed by `unit`, not by `group_key`. Two assets with the same display name but different group keys would clash (one expand toggles both). Not currently reachable — `unit` is the asset's `name`, and tapass doesn't enforce unique names across groups; flag for consideration if an operator ever mints two assets with the same display name.
- `lightning_info` and `taproot_assets` are declared but unused by the render logic today. Leave them on the input surface — removing them would force a parent refactor and they are plausibly useful (version labels, asset metadata) for future expansion of the card.
- No subscriptions, no lifecycle hooks — safe to re-render freely; no `ngOnDestroy` needed.
- The mobile-layout toggle is SCSS-only (`.mobile &`) — no JS branch reads `device_type === 'mobile'` outside the `display_mode` ternary for the flow graphic.
