# `orc-mint-general-activity`

Source: [mint-general-activity.component.ts](../../src/client/modules/mint/modules/mint-general/components/mint-general-activity/mint-general-activity.component.ts) · [`.html`](../../src/client/modules/mint/modules/mint-general/components/mint-general-activity/mint-general-activity.component.html)

## Purpose

The **Activity** card on the dashboard (`/`) and the mint subsection dashboard (`/mint`) summarising the mint's recent operational activity over a selectable period (24 hours · 3 days · 7 days). It is a pure presentational container — no service calls, no subscriptions of its own. Its job is to render:

- a top row of two summary tiles: total operations count and total unit volume (each with a `▲ / ▼ %` delta vs. the previous period of the same length)
- three sparkline tiles (Mints · Melts · Swaps), each showing the per-bucket count plus a delta-coloured area chart
- two completion tiles (Mints completed · Melts completed) with `orc-progress-circle` ring + percentage + delta + `formatDuration`-rendered average time
- an optional warnings strip when the server reports archive-in-progress
- a `mat-menu` period picker that emits `period_change` so the parent can re-fetch a new summary

The card emits `period_change` exactly once per menu pick; both current parents catch it, call `mintService.clearActivityCache()`, and reload `mint_activity_summary` for the new period.

## Where it renders

- **Dashboard tile** — [`orc-index-subsection-dashboard-mint-enabled`](../../src/client/modules/index/modules/index-subsection-dashboard/components/index-subsection-dashboard-mint-enabled/index-subsection-dashboard-mint-enabled.component.html:28) on `/`. Mounted only when `enabled_mint` is true in runtime config AND the parent's `loading()` (the static-mint-data loader, not the activity loader) is false. The activity card itself receives `loading_activity` / `error_activity` from the outer `IndexSubsectionDashboardComponent`, which loads `mint_activity_summary` via its own pipeline ([index-subsection-dashboard.component.ts:400](../../src/client/modules/index/modules/index-subsection-dashboard/components/index-subsection-dashboard/index-subsection-dashboard.component.ts#L400)) — so the card mounts *as soon as static mint data is ready* and shows its own internal `loading` spinner until the summary itself returns.
- **Mint subsection dashboard summary tile** — [`orc-mint-subsection-dashboard`](../../src/client/modules/mint/modules/mint-subsection-dashboard/components/mint-subsection-dashboard/mint-subsection-dashboard.component.html:31) on `/mint`. Always mounted within the loaded mint dashboard; the dashboard kicks off `loadActivitySummary(MintActivityPeriod.Day)` in `ngOnInit` ([mint-subsection-dashboard.component.ts:212](../../src/client/modules/mint/modules/mint-subsection-dashboard/components/mint-subsection-dashboard/mint-subsection-dashboard.component.ts#L212)).

Neither parent projects anything into the component (it has no `<ng-content>` slot).

## Inputs

| Input | Type | Required | Notes |
|---|---|---|---|
| `summary` | `MintActivitySummary \| null` | ✓ | From the `mint_activity_summary(period, timezone)` GraphQL query, wrapped in [`MintActivitySummary`](../../src/client/modules/mint/classes/mint-activity-summary.class.ts). `null` until the first response lands or after a period switch invalidates the cache. The whole populated branch of the template is gated by `@if (summary())`. |
| `loading` | `boolean` | optional (default `false`) | Parent's `loading_activity` / `loading_mint_activity` signal. While true, the card swaps the populated branch for an indeterminate `mat-progress-spinner` overlay. |
| `error` | `boolean` | optional (default `false`) | Parent's `error_activity` / `error_mint_activity` signal. True when `loadMintActivitySummary` errors out. While true, the card renders an error glyph + "Failed to load activity" message instead of data. |

`loading` takes precedence over `error`, which in turn takes precedence over `summary()` (see template `@if / @else if / @else if` chain at [mint-general-activity.component.html:16-198](../../src/client/modules/mint/modules/mint-general/components/mint-general-activity/mint-general-activity.component.html#L16)). All three falsy with non-null `summary()` ⇒ populated branch.

## Outputs & projected content

- `(period_change)` — `EventEmitter<MintActivityPeriod>` fired by `onPeriodChange(period)` whenever the user picks a value from the `mat-menu`. Emits the new period only — the component does *not* refetch on its own; the parent owns the data pipeline. Both parents react by calling `mintService.clearActivityCache()` then `loadMintActivitySummary(period)`.
- No `<ng-content>` slot.

## Derived / computed signals

- `period_label` → `string` — `'24 hours' | '3 days' | '7 days'`. Looks up the option in `period_options` whose `value` matches `selected_period()`. Falls back to `'7 days'` if the lookup misses (a defensive default; the three enum values are the only reachable ones today).
- `selected_period` → writable `signal<MintActivityPeriod>` initialised to `MintActivityPeriod.Day`. Set only by `onPeriodChange()`. **Important**: this signal is the component's local state and is *not* synchronised with the parent's `selected_activity_period` — the menu's checkmark and label always reflect what the user clicked here, regardless of what the parent re-emits or refetches.

There are no `computed()` signals on the public surface beyond `period_label`. Chart datasets are non-reactive instance fields (`mint_chart_data` / `melt_chart_data` / `swap_chart_data` / `sparkline_options`), rebuilt imperatively in `ngOnChanges` when `loading` flips from `true` to `false`.

## Happy path

1. Parent finishes loading static mint data, mounts the card with `summary=null, loading=true, error=false`.
2. Card shows the centred `mat-progress-spinner` (state: **loading**).
3. Parent's `mint_activity_summary` query resolves; parent flips `loading=false` and feeds `summary=<MintActivitySummary>`. `ngOnChanges` notices `loading` flipped to `false` and calls `initCharts()` → builds `mint_chart_data`, `melt_chart_data`, `swap_chart_data` from the sparkline buckets and the corresponding `_count_delta` (delta drives the area gradient colour: green for ≥ 0, red for < 0).
4. Populated branch renders: title row "Activity" + period button "24 hours"; two top tiles (operations · volume); three sparkline tiles (mints · melts · swaps) with `chart.js` line charts mounted on `<canvas baseChart>`; two completion tiles with `orc-progress-circle` rings + `formatDuration(seconds)` avg-time labels.
5. User clicks the period button → `mat-menu` opens with three radio-style entries (`check` icon next to the active one).
6. User picks "7 days" → `onPeriodChange(MintActivityPeriod.Week)` fires; `selected_period` flips, label updates to "7 days", `(period_change)` emits. Parent reloads. Card flashes through state **loading** → state **populated** with the new shape.

## Reachable states

### 1. Populated — positive deltas (live)

Live state on `lnd-nutshell-sqlite` `/` after the e2e bitcoin-syncing + mint-balance-sheet specs have run their mint/melt/swap operations within the last 24 hours. Captured live with these readings:

- **top tiles**: Operations `11` · Unit volume `6,214` — both `▲ 100%` (green; `total_*_delta >= 0`)
- **sparkline tiles**: Mints `5` · Melts `3` · Swaps `3` — each `▲ 100%`, each with a green-tinted area sparkline rendered through 24 hourly buckets
- **completion tiles**: Mints completed `100%` `▲100%` `600ms avg time` (mint_avg_time = 0.6s ⇒ `formatDuration` returns `'600ms'`); Melts completed `100%` `▲100%` `333ms avg time` (melt_avg_time = 0.333s)
- **warnings**: hidden (`summary().warnings.length === 0`)

The sparkline tiles each render a faint background watermark icon (`payments` for Mints, `mode_heat` for Melts, `swap_calls` for Swaps) at `opacity: 0.05`; the `<canvas>` overlays it once `mint_chart_data` is non-null.

### 2. Populated — negative deltas + warnings strip

Reached by overriding `summary()` to set `total_operations_delta = -42.5`, `total_volume_delta = -100`, `mint_count_delta = -25`, `melt_count_delta = -33.3`, `swap_count_delta = -50`, `mint_completed_pct_delta = -20`, `melt_completed_pct_delta = -10`, plus `warnings: ['Mint analytics are still being archived. Currently processing: Apr 20, 2026.']`.

- every `.delta` span flips to `.delta-negative` (red) with a `▼` glyph
- sparkline gradient repaints in red (`getDeltaColor` returns `--orc-status-inactive` when delta < 0); requires `initCharts()` to re-run, so triggering this in production happens naturally on the next `loading` true→false flip after a period change
- a `.orc-warning-card` strip appears below the completion tiles, one `<span>` per warning; uses `font-size-xs`
- `formatDuration` rendered: mint_avg_time `2.5` ⇒ `'2500ms'` (because `< 5`), melt_avg_time `90` ⇒ `'2m'` (because `< 3600`)

### 3. Populated — all zeros

Reached by overriding `summary()` to set every count, delta, pct, and avg_time to `0`, sparklines `[]`, and pre-init chart data to `null`.

- top tiles read `0` / `0`; deltas `▲ 0%` (green — the template uses `value >= 0` for `.delta-positive`, so a delta of exactly 0 still tints green)
- sparkline tiles read `0` / `0` / `0`, each with `▲ 0%`, **no `<canvas>` rendered** because `mint_chart_data` etc. are `null` (the `@if (mint_chart_data)` block skips). The watermark icon remains visible since the `.sparkline-card` container is always rendered.
- completion tiles read `0%` / `0s` (because `formatDuration(0) === '0s'`)
- no warnings strip

This is the shape an operator sees on a freshly-archived mint with no recent activity.

### 4. Loading

`loading() === true`. Captured live by overriding the input.

- entire populated branch is replaced by a centred `mat-progress-spinner` (`mode="indeterminate" diameter="30"`) inside `.activity-loading` — an absolutely-positioned overlay covering the card body
- the title row "Activity" + period button "24 hours" remains visible above the card
- when `loading` flips back to `false`, `ngOnChanges` calls `initCharts()` to rebuild the three sparkline datasets from the latest `summary()`. This is the only path that creates chart data — first render with `loading: false` from the start *also* executes through this path because the parent always toggles `loading` true→false; if a parent skipped that flip the charts would never build (documented under unhappy cases).

### 5. Error

`error() === true` (and `loading() === false`). Captured live by overriding.

- entire populated branch replaced by a centred glyph (`mat-icon` with text `error_outline`) + the literal string `Failed to load activity` (`font-size-s orc-outline-color`)
- both icon + label are wrapped in the same `.activity-loading` overlay as the loading state, so the card height stays constant
- title row + period button remain visible

This is what shows on a transport error from `mint_activity_summary`. The error message is intentionally generic since this is a self-hosted FOSS deployment and operators read the network tab / server logs for the actual cause (per `AGENTS.md`).

### 6. Period menu open

Click the `.mint-activity-period-selector button`. A CDK overlay appears anchored below-and-before the trigger button containing three `mat-menu-item` entries:

| Label | Active when | Icon slot |
|---|---|---|
| `24 hours` | `selected_period() === 'day'` | `check` glyph (active) or empty (`mat-icon` is rendered either way; only the text differs) |
| `3 days` | `selected_period() === 'three_day'` | same |
| `7 days` | `selected_period() === 'week'` | same |

Active row also gets the CSS class `active-period-option`. Clicking any row fires `onPeriodChange(value)` which (a) sets `selected_period`, (b) emits `(period_change)`, (c) implicitly closes the menu via `mat-menu-item`'s default close-on-click behaviour.

### 7. Period switched — `3 days` / `7 days`

After picking either non-default period, `period_label()` updates to the new value and the card cycles loading → populated with a freshly fetched summary (different bucket size — server uses 24-hour buckets for both 3-day and 7-day periods, vs. 1-hour buckets for 24 hours, see [mintactivity.service.ts:35-39](../../src/server/modules/api/mint/activity/mintactivity.service.ts#L35)). Visually identical to state 1 except the tile numbers reflect the larger window.

`selected_period` is component-local state — reloading the page resets it to `MintActivityPeriod.Day` and the parent's initial `loadMintActivitySummary(MintActivityPeriod.Day)` call matches it. There is no localStorage persistence for this picker.

## Child components

### `orc-progress-circle` (Mints completed · Melts completed rings)

Two instances per populated render. Source: [progress-circle.component.ts](../../src/client/modules/progress/components/progress-circle/progress-circle.component.ts) · [`.html`](../../src/client/modules/progress/components/progress-circle/progress-circle.component.html).

#### Parent → child data contract

The parent passes:

| Field | Source | Value |
|---|---|---|
| `value` | `summary()!.mint_completed_pct` / `summary()!.melt_completed_pct` | `0–100` (or above 100 if completion outpaces creation, but the server's ratio caps at 100 per construction at [mintactivity.service.ts:129](../../src/server/modules/api/mint/activity/mintactivity.service.ts#L129)) |
| `diameter` | literal | `40` (px) |
| `stroke_width` | literal | `3` (px) |
| `progress_color` | literal | `'orc-status-active-progress-spinner'` — the green progress colour token |

`background_color` defaults to `'orc-background-progress-spinner'`. `value` is `input.required` — passing `null` would render nothing because the child's template is `@if (value() !== null)`-guarded.

#### Child reachable states

The component is purely presentational — two stacked `mat-progress-spinner`s, one for the background ring and one for the foreground arc — so the only state surface is the `value` input:

- `0` → empty ring, both spinners visible at zero progress
- `100` → full ring (green)
- intermediate values → partial arc (e.g. `80` → 80%)
- `> 100` → spinner clamps internally; not reachable from this parent given server-side construction

No interactions, no outputs, no further nested children. Documented for completeness; not separately specced.

### `mat-menu` period picker

Not a project component but a Material directive. Rendered as a CDK overlay anchored to the trigger button via `[matMenuTriggerFor]`. Inside: three `<button mat-menu-item>` rows wrapped in a template `<mat-menu>`. Behaviour:

- opens on trigger click; closes on item click (default `mat-menu-item` behaviour), backdrop click, or `Esc`
- positioned via `yPosition="below" xPosition="before"` — i.e. drops down from the right edge of the button
- overlays the page at `z-index` set by Material's CDK; spawns into the global `body > .cdk-overlay-container`

The menu is *not* a child Orchard component, so `getComponent(menu_host)` returns null. Tests interact with it by selector probes against `.cdk-overlay-pane button[mat-menu-item]`.

### `<canvas baseChart>` sparkline (chart.js via `ng2-charts`)

Three instances when populated (one per Mints / Melts / Swaps tile). Renders the `mint_chart_data` / `melt_chart_data` / `swap_chart_data` line dataset using `sparkline_options` (no axes, no legend, no tooltips, animation 600ms, tension 0.4). Background fill is a vertical gradient produced by [`ChartService.createAreaGradient`](../../src/client/modules/chart/services/chart/chart.service.ts) from the delta-driven colour token (`--orc-status-active` for delta ≥ 0, `--orc-status-inactive` otherwise).

The canvas is absolutely positioned over the watermark icon (`top: 2rem; right/bottom/left: 0`); when chart data is null the canvas is omitted but the watermark remains.

No interactions — `tooltip.enabled` is false and the component does not register hover handlers.

## Unhappy / edge cases

- **`summary()` non-null but `mint_sparkline = []`** (or `melt_sparkline = []`, `swap_sparkline = []`) — `initCharts` builds a dataset whose `labels` and `data` arrays are empty; chart.js renders nothing visible inside the canvas while the canvas element itself still mounts. Watermark remains. Operator-facing this looks identical to "no activity in the period".
- **`loading` flipped false → true → false** — `ngOnChanges` checks `!firstChange`, so the first render with `loading=false` skips `initCharts()`. The `summary()` populated branch still renders, but the `@if (mint_chart_data)` blocks skip and no canvases mount. **Workaround the parents already use**: both parents start with `loading=true` then flip to `false` once the query resolves, which trips the rebuild path. A parent that mounts the card with `loading=false` from the start will render the data tiles without sparklines until the next `loading` flip. Documented; no fix.
- **`summary()` flipped to a new instance without a `loading` round-trip** — same as above. The chart data is non-reactive, so a new summary that arrives mid-period (e.g. via cache invalidation outside the period-change flow) won't repaint the sparklines. Both current parents always toggle `loading` around `loadMintActivitySummary`, so this is unobserved.
- **`mint_avg_time = 0.0001`** — `formatDuration` returns `'0ms'` (rounds to zero); not technically an error but operator-visible. The `seconds === 0` early return catches the literal-zero case but not near-zero floats.
- **`mint_avg_time` very large (> 3600)** — formatted as `'1.0h'` / `'2.0h'` etc. via `(seconds / 3600).toFixed(1)`. No upper bound; a 24-hour avg would render `'24.0h'` rather than days, which is operator-confusing but not broken.
- **`warnings` contains many entries** — each renders as a separate `<span class="font-size-xs">` inside the same `.orc-warning-card` row, so they end up concatenated visually with no separator. Server today only ever emits one entry, but if multiple warnings ship a separator + line break would be needed.
- **Locale numbers** — all numeric tile values run through Angular's `number` pipe (`{{ ... | number }}` for counts, `'1.0-0'` for percentage rounding). `formatDuration` does *not* use the locale-aware pipe — `.toFixed(1)` always emits a `.` decimal, breaking right-decimal locales like `de-DE`. Documented; not currently exercised since the test stacks all run `en`.
- **Period menu picked while a request is in flight** — the parents' implementations call `clearActivityCache()` before re-querying, so the in-flight request's response is discarded by the cache. The card flashes the new period's `period_label` immediately (signal-based) and the spinner reappears once the parent flips `loading=true`. No race surfaces in current parents.

## Template structure (at a glance)

```
.flex-column
├── header row (.flex-justify-between)
│   ├── "Activity" title (.title-l)
│   └── .mint-activity-period-selector
│       └── button[matMenuTriggerFor=period_menu]
│           ├── mat-icon "calendar_today"
│           └── span {{ period_label() }}
└── mat-card.mint-activity-card
    └── mat-card-content
        ├── @if (loading())   → .activity-loading > mat-progress-spinner
        ├── @else if (error()) → .activity-loading > mat-icon "error_outline" + "Failed to load activity"
        └── @else if (summary())
            ├── top row (2 .orc-high-card)
            │   ├── Operations  + delta
            │   └── Unit volume + delta
            ├── sparkline row (3 .orc-high-card.sparkline-card)
            │   ├── Mints  + delta + watermark + (canvas if mint_chart_data)
            │   ├── Melts  + delta + watermark + (canvas if melt_chart_data)
            │   └── Swaps  + delta + watermark + (canvas if swap_chart_data)
            ├── completion row (2 .orc-high-card)
            │   ├── orc-progress-circle + "{ pct }%" + delta + "Mints completed" + "{ formatDuration }" + "avg time"
            │   └── orc-progress-circle + "{ pct }%" + delta + "Melts completed" + "{ formatDuration }" + "avg time"
            └── @if (warnings.length > 0) → .orc-warning-card > @for warning → <span>

<ng-template #deltaRef>          <!-- shared delta chip rendered 7× -->
  <span.delta[.positive|.negative]>{ ▲ | ▼ } { abs | number:'1.0-0' }%</span>

<mat-menu #period_menu>
  └── @for option of period_options
      └── button[mat-menu-item][.active-period-option?]
          ├── mat-icon "check" or empty
          └── { option.label }
```

## Interaction summary

| Gesture | Target | Result |
|---|---|---|
| click period button | `.mint-activity-period-selector button` | opens `#period_menu` CDK overlay anchored below-before |
| click "24 hours" / "3 days" / "7 days" | `mat-menu-item` inside the overlay | `onPeriodChange(value)` → `selected_period.set(value)`, `(period_change).emit(value)`, menu closes |
| click backdrop / press `Esc` | CDK overlay backdrop | menu closes; no `period_change` emitted |
| hover any tile | n/a | no ripple, no state change (tiles are plain `<div class="orc-high-card">`, not buttons) |
| hover sparkline canvas | chart.js | suppressed — `tooltip.enabled: false` and no hover plugin registered |
| keyboard `Tab` | period button | focusable; `Enter` opens the menu equivalently |

The tiles themselves are non-interactive — the only emitting gesture is the period change.

## Test-author handoff

### Host page + setup

- **Route**: `/` is the recommended test surface; `index-subsection-dashboard-mint-enabled` mounts the same component with the same input wiring as `/mint`. Pick `/` for parity with the other dashboard specs in `e2e/specs/`.
- **`beforeEach`**: `await page.goto('/')`. Auth via `loginViaUi` (no shared `storageState` set up yet — see [`bitcoin-general-info.spec.ts`](./bitcoin-general-info.spec.ts) for the pattern). Wait for `card.getByText('Activity', {exact: true})` before asserting any tile (the wrapping `@if (!loading())` of the parent gates the whole `mint-enabled` block).
- **Tag**: `@mint`. Not part of `@canary` — the populated state requires a non-trivial activity volume in the last 24 hours, which is fixture-dependent. The card is fast to render but the live numbers depend on whatever earlier specs in the run produced.

### Differential oracles

| Input | Oracle | Helper call |
|---|---|---|
| `summary` | Orchard `mint_activity_summary` query (server reads `mint_analytics_cache`) | **gap** — no helper yet. Add `mint.getActivitySummary(config, period)` to [`e2e/helpers/backend/mint.ts`](../../e2e/helpers/backend/mint.ts) that issues the same GraphQL query via supertest and returns the typed payload. Asserting tile counts against this oracle protects against a regression where the resolver and the client `summary` shape drift. Until the helper exists, assert against rendered text only and do not pin numeric values. |
| `loading` | parent state | Not assertable from a backend; assert that the spinner has cleared by the time the `Operations` tile is visible. |
| `error` | parent state | Not assertable from a backend; reachable only by force-faulting the resolver (see *State reachability*). |

The component does no GraphQL itself — all three inputs are derived from the parent's `loadMintActivitySummary(period)` call. The differential oracle for *content* is therefore the same query the client runs.

### State reachability matrix

| State | `lnd-nutshell-sqlite` | `lnd-cdk-sqlite` | `cln-cdk-postgres` | `cln-nutshell-postgres` |
|---|---|---|---|---|
| 1. Populated — positive deltas (live) | ✓ live | ✓ live | ✓ live | ✓ live |
| 2. Populated — negative deltas + warnings | — synthetic (signal override) | — synthetic | — synthetic | — synthetic |
| 3. Populated — all zeros | — synthetic *(or fixture-only on a fresh stack with zero activity in the last 24h)* | — synthetic | — synthetic | — synthetic |
| 4. Loading | — synthetic (transient on first paint, race-prone) | — synthetic | — synthetic | — synthetic |
| 5. Error | — disruptive (would require faulting the resolver, e.g. `docker pause` mint or DB) | — disruptive | — disruptive | — disruptive |
| 6. Period menu open | ✓ live (click trigger button) | ✓ live | ✓ live | ✓ live |
| 7. Period switched — 3 days | ✓ live | ✓ live | ✓ live | ✓ live |
| 7. Period switched — 7 days | ✓ live | ✓ live | ✓ live | ✓ live |

State 1 is reachable on every stack but the *contents* of the tiles depend on what mint/melt/swap operations the run produced. The card is only meaningful after at least one mint/melt/swap has landed; on a freshly-booted stack with no operations the card renders as state 3 (all zeros) until traffic arrives. The fake stack (`fake-cdk-postgres`) is excluded — that stack still mints (cdk-mintd boots), but the dashboard's `index-subsection-dashboard-mint-enabled` is not gated on Lightning, so the card mounts there too; it's just outside the four named e2e projects.

### Per-state probes

`card` shorthand: `page.locator('orc-mint-general-activity').first()`.

| State | Settled signal (wait for) | Primary assert |
|---|---|---|
| 1. Populated — positive deltas | `card.getByText('Operations', {exact: true})` visible | `card.locator('.orc-high-card')` count === 7 AND `card.locator('canvas')` count === 3 AND `card.locator('.delta-positive')` count === 7 |
| 2. Populated — negative deltas + warnings | `card.locator('.orc-warning-card')` visible | `card.locator('.delta-negative')` count > 0 AND `card.locator('.orc-warning-card')` visible |
| 3. Populated — all zeros | `card.getByText('Operations', {exact: true})` visible | `card.locator('.orc-high-card').first().getByText('0', {exact: true})` visible AND `card.locator('canvas')` count === 0 |
| 4. Loading | `card.locator('.activity-loading mat-progress-spinner')` visible | `card.locator('.orc-high-card')` count === 0 AND `card.locator('.activity-loading mat-progress-spinner')` count === 1 |
| 5. Error | `card.locator('.activity-loading')` visible with `mat-icon` child | `card.getByText('Failed to load activity', {exact: true})` visible AND `card.locator('.activity-loading mat-progress-spinner')` count === 0 |
| 6. Period menu open | `page.locator('.cdk-overlay-pane button[mat-menu-item]').first()` visible | `page.locator('.cdk-overlay-pane button[mat-menu-item]')` count === 3 AND `page.locator('.cdk-overlay-pane .active-period-option')` count === 1 |
| 7. Period switched | `card.locator('.mint-activity-period-selector button').getByText('3 days')` (or `7 days`) visible | `card.locator('canvas')` count === 3 (after the new summary lands) AND the menu's `check` glyph has moved to the picked row when reopened |

All locators verified with `document.querySelectorAll(selector).length === N` against the live preview at the moment of capture. The `.activity-loading mat-progress-spinner` locator is scoped to the wrapper to avoid colliding with the four `mat-progress-spinner`s that mount inside the two `orc-progress-circle` rings during the populated state.

### Reusable interaction recipes

- **Material menu pick (period change)** — click the trigger via `card.locator('.mint-activity-period-selector button').click()`, then click the option via `page.locator('.cdk-overlay-pane button[mat-menu-item]', {hasText: '7 days'}).click()`. **Do not** use `preview_fill` against menu items (they're buttons, not inputs) and **do not** rely on `mat-menu-item` `(click)` to fire before the overlay backdrop click that closes the menu — they fire in the same microtask, and Material guarantees the item handler runs first. Same pattern as the dashboard's chart-type menus on `/mint`.
- **Wait for chart settle** — chart.js animation is 600ms (`sparkline_options.animation.duration`). Don't screenshot the canvas until at least one `requestAnimationFrame` past the populated branch's first paint, otherwise the gradient fill is still tweening. Asserting on count rather than pixels (as the probe table does) sidesteps this.
- **Force the error branch** — synthetic only. There is no `docker pause` target that *only* breaks `mint_activity_summary` without breaking the whole page. Either skip the test or override `error` via `page.evaluate(() => window.ng.getComponent(host).error = () => true; window.ng.applyChanges(cmp))` in a Karma-side test; this is the *unit-better* path.
- **Read the `period_change` emission** — Playwright cannot directly observe `EventEmitter`. Assert the post-emission side effect: parent's reload triggers a fresh `POST /api` with `query MintActivitySummary` and the new `period` variable. Use `page.waitForResponse(r => r.url().endsWith('/api') && r.postData()?.includes('"period":"week"'))` after clicking "7 days".
- **Differential against backend oracle** — once `mint.getActivitySummary(config, period)` is added (see *Differential oracles*), shape: `expect(card.locator('.orc-high-card').nth(0).locator('.font-size-xl').innerText()).resolves.toBe(String(oracle.total_operations))`. Until then, assert structure (counts, classes, presence of warnings strip) only.

### Skip taxonomy

- State 2 (negative deltas + warnings): `fixture-only` for natural reachability — the warning row only appears while the analytics backfill is mid-run, which on an e2e stack happens for ~seconds at boot before settling. Capture in unit tests instead. Negative deltas require the *current* period to have lower counts than the *prior* period, which the e2e fixtures do not arrange; would need a synthetic seed.
- State 3 (all zeros): `fixture-only` — reachable on a freshly booted mint with no activity, but every other e2e spec in the run produces at least one mint operation, polluting the 24-hour window. Could be tested in isolation under a `@isolated` tag.
- State 4 (loading): `unit-better` — transient first-paint state, race-prone in Playwright. Karma can mount the component with `loading=true` deterministically.
- State 5 (error): `disruptive` — `docker pause` of the mint container surfaces the error but breaks every other mint-touching spec running against the same stack. Defer until a destructive-tier project is added.
- State 6 (period menu open): testable via Playwright. No skip.
- State 7 (period switch): testable via Playwright. No skip.

## Test fidelity hooks

No `mint-general-activity.spec.ts` exists yet. The Karma unit spec [`mint-general-activity.component.spec.ts`](../../src/client/modules/mint/modules/mint-general/components/mint-general-activity/mint-general-activity.component.spec.ts) only asserts `should create` against an empty input set — it does not exercise any rendered branches.

When writing `e2e/specs/mint-general-activity.spec.ts`, cover at minimum:

- state 1 (live, populated): card title `Activity` visible; period button reads `24 hours`; seven `.orc-high-card` tiles mount; three `<canvas>` elements mount; two `orc-progress-circle` instances; seven `.delta` chips visible (count exact)
- state 6 (period menu open): clicking the period button shows three `mat-menu-item` rows with text `24 hours` / `3 days` / `7 days`; exactly one row has class `active-period-option`; `check` glyph is present on that row
- state 7 (period switched): clicking `7 days` (a) closes the menu, (b) updates the trigger button label to `7 days`, (c) fires a `mint_activity_summary` request with `"period":"week"` (assert via `page.waitForResponse`), (d) reopening the menu shows the check on the `7 days` row

States NOT covered, with skip-taxonomy tags:

- state 2 (negative deltas + warnings) — `fixture-only`: would need a seeded prior-period dataset that exceeds the current period, plus an active backfill run for the warnings
- state 3 (all zeros) — `fixture-only`: pollution from sibling specs in the same run
- state 4 (loading) — `unit-better`: race-prone in Playwright; covered better in Karma
- state 5 (error) — `disruptive`: `docker pause` mint container; defer to destructive tier
- `formatDuration` thresholds (`0s` / `500ms` / `12s` / `2m` / `1.0h`) — `unit-better`: pure function, exhaustive coverage belongs in `mint-general-activity.component.spec.ts` with table-driven assertions

Child-component states skipped at the e2e level:

- `orc-progress-circle` `value === 0` (empty ring) — `fixture-only`: requires zero completion in the period
- `orc-progress-circle` `value > 100` — `dead-branch`: server clamps; cover in Karma if a regression risk emerges
- chart.js sparkline visual fidelity (gradient colour, area fill height) — `unit-better`: pixel-level assertions are flaky in headless Chrome; assert on `<canvas>` mount only at e2e tier

## Notes for implementers

- `OnPush` with signal inputs *plus* imperative chart rebuilding via `ngOnChanges` — this is the only chart in the dashboard that doesn't go through a `computed()` graph for its data. Adding a fourth sparkline (or a new tile) means extending both `initCharts()` and the template's `@if` mount guards in lockstep.
- `selected_period` is component-local. If a future requirement is to persist the picker across page loads (the chart-type menu on `/mint` does persist via `settingDeviceService.setMintDashboardSettings`), it would need to flow through the parents' `page_settings` signal, not be added here.
- Both parents call `mintService.clearActivityCache()` *before* `loadMintActivitySummary(period)` on every period change. Removing that call would let the cache return the previous period's data when the user toggles back-and-forth, masking real issues.
- The `getDeltaColor` lookup runs once per chart (three times per render) and reads from `themeService.getThemeColor(token, theme)` — synchronous, no subscription. If the theme changes after the chart paints, the chart background does *not* repaint until the next `loading` flip. Acceptable today (theme switch is rare and triggers a full app reload via `SettingDeviceService`); document if that ever stops being the case.
- The component declares `OnChanges` but no other lifecycle hooks; no `ngOnDestroy` cleanup is required because there are no subscriptions. If a future change adds an internal `chartService` subscription, add an explicit unsubscribe — the current parents both kill the page on navigation, so a leaked subscription would only surface on the same-page hot reload paths.
- The `value >= 0` predicate on the `.delta` template means a literal-zero delta paints green, not neutral. If a designer requests a "no change" tri-state colour, the template needs three classes, not two.
