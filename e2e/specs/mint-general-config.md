# `orc-mint-general-config`

Source: [mint-general-config.component.ts](../../src/client/modules/mint/modules/mint-general/components/mint-general-config/mint-general-config.component.ts) · [`.html`](../../src/client/modules/mint/modules/mint-general/components/mint-general-config/mint-general-config.component.html)

## Purpose

The **Config** card on `/mint` summarising the mint daemon's NUT-06 advertised capabilities. Pure presentational container — single `info` input, no service calls, no subscriptions, no outputs. Renders three blocks, top to bottom:

- one chip per supported NUT, dot-coloured by support status (active / enabled / disabled / inactive)
- two pills indicating whether minting (NUT-04) and melting (NUT-05) are enabled or disabled
- one row per `(method, unit)` for both NUT-04 minting and NUT-05 melting, drawing a min → max range bar scaled relative to the largest `max_amount` seen in that unit across both directions

## Where it renders

- **Only usage**: [`orc-mint-subsection-dashboard`](../../src/client/modules/mint/modules/mint-subsection-dashboard/components/mint-subsection-dashboard/mint-subsection-dashboard.component.html:19) at `/mint`, right tile of the top summary row.
- Always mounted whenever the parent dashboard loads. The parent passes `mint_info` (a `MintInfo | null` resolved by `mintInfoResolver`); no gating `@if` wraps the component itself.

## Inputs

| Input | Type | Required | Notes |
|---|---|---|---|
| `info` | `MintInfo \| null` | ✓ | From the route's `mintInfoResolver` ([mint-section.module.ts:127](../../src/client/modules/mint/modules/mint-section/mint-section.module.ts#L127)). `MintInfo` is a thin class wrapper around `OrchardMintInfo` from `mintInfo` GraphQL — only `info.nuts` is read here. Null is tolerated: every computed signal handles `info()?.nuts?.…?` and falls through to `[]`/`'active'`. |

## Outputs & projected content

- No `@Output()`s.
- No `<ng-content>` slots.

## Derived / computed signals

- `nuts` → `Array<{number: number; status: GraphicStatusState}>`
  - Iterates `Object.entries(info.nuts)`, keeps keys that start with `nut`, parses the trailing digits.
  - Per-entry status comes from `getNutStatus(number, value)` — see logic below. NUT-04 / NUT-05 use a different palette (`active`/`inactive`) than every other NUT (`enabled`/`disabled`).
- `minting_status` → `'inactive' | 'active'` — `info.nuts.nut4.disabled` ⇒ `'inactive'`, else `'active'`.
- `melting_status` → `'inactive' | 'active'` — same logic over `nuts.nut5.disabled`.
- `minting_limits` → `MethodLimit[]` — projects `info.nuts.nut4.methods` to `{method, unit, min_amount, max_amount}`, coercing `undefined` to `null`.
- `melting_limits` → `MethodLimit[]` — same shape over `nuts.nut5.methods`.
- `max_by_unit` (private) → `Map<unit, number | null>` — over the union of minting + melting limits; per unit, the largest `max_amount`. **A single `null` (unlimited) entry sticks the whole unit at `null`** ([mint-general-config.component.ts:62-68](../../src/client/modules/mint/modules/mint-general-config/mint-general-config.component.ts#L62)).
- `getTrackWidthPercent(limit)` (method, not signal) → `number` (5 – 100): `100` if the limit's own `max_amount` is null, `100` if the unit's max is null/0/undefined, else `max(5, limit.max / unit_max * 100)`. The `5` floor keeps a sliver-width bar visible even when one method's max is dwarfed.

### `getNutStatus` branch table

Implemented at [mint-general-config.component.ts:81-89](../../src/client/modules/mint/modules/mint-general-config/mint-general-config.component.ts#L81). Yields different palettes for NUT-04/05 vs everything else:

| Input shape | NUT-04 / NUT-05 | All other NUTs |
|---|---|---|
| `nut == null` (key exists, value is `null` like nutshell's `nut19`) | `'inactive'` | `'disabled'` |
| typeof not object (other primitive) | `'inactive'` | `'disabled'` |
| object with `disabled: true` | `'inactive'` | `'disabled'` |
| object with `disabled: false` | `'active'` | `'enabled'` |
| object with `supported: true` (no `disabled`) | (n/a — schema always has `disabled`) | `'enabled'` |
| object with `supported: false` | (n/a) | `'disabled'` |
| object with neither `disabled` nor `supported` (e.g. NUT-15 `methods`-only, NUT-17 `supported`-array) | (n/a) | `'enabled'` (final fallthrough) |

`GraphicStatusState` palette ([graphic-status.types.ts](../../src/client/modules/graphic/types/graphic-status.types.ts)) → CSS class:

| Status | Class | Visible swatch |
|---|---|---|
| `active` | `orc-status-active-bg` | green dot (NUT-04/05 enabled) |
| `inactive` | `orc-status-inactive-bg` | red dot (NUT-04/05 disabled) |
| `enabled` | `orc-primary-bg` | primary-tinted dot (any NUT supported) |
| `disabled` | `orc-outline-variant-bg` | muted/grey dot (any NUT off or absent) |
| `warning`, `loading`, `null` | (other / unused here) | n/a |

## Happy path

1. Parent route resolves `mint_info`; the dashboard component renders `<orc-mint-general-config [info]="mint_info">`.
2. Top block: 16 nut chips render in schema order — `4 5 7 8 9 10 11 12 14 15 17 19 20 21 22 29`. The chip *count and order* are schema-driven (`MINT_INFO_QUERY` selects every nullable `nutN` field on `OrchardNuts`, so the GraphQL response always carries all 16 keys); the chip *status* is daemon-driven. NUT-04 and NUT-05 are green (`active`), every NUT past 4/5 the daemon publishes as an object is a primary-tinted dot (`enabled`), and any nut whose value is `null` (e.g. nutshell's nut19/21/22/29, cdk's nut21/22) is muted/grey (`disabled`).
3. "Supported Nuts" caption sits below the chip row.
4. Below: two row-pills. Left = "Minting enabled" (green dot) when `nuts.nut4.disabled === false`, "Minting disabled" (red dot) otherwise. Right = same for melting / NUT-05.
5. Below: two columns side by side. Left "Minting Limits" (NUT-04 methods), right "Melting Limits" (NUT-05 methods). Each column renders one row per `(method, unit)` tuple from the daemon's `methods` array. A row has the unit asset glyph + payment-method badge ("BOLT 11" / "BOLT 12" / raw method string) on top, and a min → bar → max line below. Min defaults to `1` when the daemon publishes `null`; max renders `∞` when the daemon publishes `null`.
6. The bar's width is scaled so the largest `max_amount` in that unit (over **both** minting and melting) hits 100%; smaller maxes get a proportional fraction (floor 5%). A single null max in the unit makes every bar in that unit render full-width.

## Reachable states

### 1. Live (cdk): explicit min/max, 14 NUTs supported

- Stack: `lnd-cdk-sqlite` / `cln-cdk-postgres`.
- All 16 chips render. NUT-04 / NUT-05 = green; NUT-07, 08, 09, 10, 11, 12, 14, 15, 17, 19, 20, 29 = primary; **NUT-21 / NUT-22 = grey** (cdk-mintd doesn't publish auth in the e2e fixtures).
- Both pills: "Minting enabled" / "Melting enabled" (green dots).
- Single row each side: BOLT 11 / sat with `min_amount=1` and `max_amount=500_000` ⇒ "₿ 1 ─── ₿ 500,000". Both bars at 100% width (sole entries in the `sat` unit). This is the state the user's reference screenshot captures.

### 2. Live (nutshell): unlimited min/max, NUT-19 / 21 / 22 / 29 absent

- Stack: `lnd-nutshell-sqlite` / `cln-nutshell-postgres`.
- 16 chips render. NUT-04 / NUT-05 = green; NUT-07–12, 14, 15, 17, 20 = primary; **NUT-19, NUT-21, NUT-22, NUT-29 = grey** because nutshell's `/v1/info` omits these keys, the resolver fills `null`, and `getNutStatus` emits `'disabled'` for `null`.
- Both pills enabled.
- Single row each side: BOLT 11 / sat with `min_amount=null` ⇒ "₿ 1" (defaulted), `max_amount=null` ⇒ "∞". `max_by_unit.get('sat')` is also null ⇒ `getTrackWidthPercent` returns 100 ⇒ both bars 100% width.

### 3. Minting disabled (NUT-04 `disabled: true`)

- NUT-04 chip dot flips green → red (`'inactive'` palette).
- Left pill becomes "Minting disabled" with a red dot.
- Right column ("Melting Limits") still renders normally.
- Reachable via signal override (no live fixture toggles `disabled: true`).

### 4. Melting disabled (NUT-05 `disabled: true`)

- Mirror of state 3 over NUT-05.
- NUT-05 chip dot red, right pill "Melting disabled" red dot.

### 5. Both disabled

- Both chips red, both pills red. Limit columns still render their methods (the `disabled` flag does not strip `methods` from the daemon payload).

### 6. Multiple methods per direction (BOLT 11 + BOLT 12)

- Left column shows two rows ("BOLT 11" with bolt icon, "BOLT 12" with double-bolt SVG icon — see `mint-general-payment-method` switch).
- The bar widths scale: with min/max `(1k, 100k)` and `(5k, 500k)` minting + `(1, 50k)` and `(100, 250k)` melting, all sharing unit `sat`, `max_by_unit('sat') = 500_000`, so widths become 20% / 100% / 10% / 50% — verified live via signal override.
- Reachable via signal override on this stack; the cdk and nutshell fixtures only advertise `bolt11`. CDK's `cln-cdk-postgres` enables `bolt12` at the LN backend but its `mintd.toml` still publishes only the `bolt11` method — see *Skip taxonomy*.

### 7. No methods on a direction (`nut4.methods === []`)

- The whole left column (label + rows) is skipped because the template's outer `@if (minting_limits().length > 0)` short-circuits the *entire* block — including the "Minting Limits" caption ([mint-general-config.component.ts.html:35](../../src/client/modules/mint/modules/mint-general/components/mint-general-config/mint-general-config.component.html#L35)).
- Same on the right side for `nut5.methods === []`.

### 8. `info()` is `null`

- All four computed signals fall through their `?.` chains: `nuts() = []`, `minting_status() = 'active'` (because `disabled` is `undefined`, falsy), `melting_status() = 'active'`, both limits `[]`.
- Visually: empty chip row (the `@for` produces nothing, but the outer flex column **does still render** so the "Supported Nuts" caption sits alone), pills both read "enabled", limit columns both collapsed.
- This is more permissive than expected — a null `info` produces a "Minting enabled / Melting enabled" reading even though the daemon never spoke. Documented gotcha; the parent's resolver only hands `null` if the `mintInfo` query failed, in which case the dashboard would also render its error banner.

### 9. Unit mix (`sat` + `usd`, distinct max_by_unit)

- Two units in the limits with their own scales: e.g. minting BOLT11 sat 1–500_000 and BOLT11 usd 100–10_000.
- `max_by_unit` becomes `{sat: 500_000, usd: 10_000}` — each row scales relative to its unit's local max, so both rows render their respective 100%.
- The asset glyph swaps via `orc-graphic-asset`'s `unit_class` — bitcoin orange disc for sat / msat / btc, dollar disc for usd, euro disc for eur, generic question-mark for any other unit string. Reachable in `fake-cdk-postgres` whose `mintd.toml` lists `supported_units = ["sat", "usd"]`, but no e2e stack currently runs that config end-to-end.

## Child components

### `orc-graphic-status`

- Source: [graphic-status.component.ts](../../src/client/modules/graphic/components/graphic-status/graphic-status.component.ts) · [`.html`](../../src/client/modules/graphic/components/graphic-status/graphic-status.component.html)
- Used 15× in the default render: 13 nut chips + the minting pill + the melting pill (size `'0.5rem'` everywhere here).
- Inputs: `size: string` (default `'0.5rem'`), `status: GraphicStatusState` (default `null`), `glow: boolean` (default `false`, never set from this parent).
- Internal: `indicator_class` computed maps the status string to one of `STATUS_CLASS_MAP`'s six classes. An unknown / null status produces an empty class string ⇒ the dot is invisible (matters when `info` arrives with an unexpected NUT key — the chip number renders but no dot).
- No interactions, no further nesting.

### `orc-graphic-asset`

- Source: [graphic-asset.component.ts](../../src/client/modules/graphic/components/graphic-asset/graphic-asset.component.ts) · [`.html`](../../src/client/modules/graphic/components/graphic-asset/graphic-asset.component.html)
- Used once per limit row (so 2× in default cdk/nutshell view). Parent passes `[unit]="limit.unit"` and `[height]="'1rem'"`. `custody` and `group_key` are not set ⇒ no custody glyph and no taproot SVG branch.
- Reachable variants from this parent:
  - `unit === 'sat'` ⇒ orange disc, bitcoin glyph (live state).
  - `unit === 'msat' | 'btc'` ⇒ same.
  - `unit === 'usd'` ⇒ green disc, `attach_money` glyph. Reachable on `fake-cdk-postgres` only.
  - `unit === 'eur'` ⇒ blue disc, `euro` glyph. No fixture exposes this.
  - any other string ⇒ grey disc, `question_mark` glyph. Dead branch from this parent unless the daemon emits a non-standard unit.
- The taproot-asset branch (`supported_taproot_asset()`) is **dead from this parent** — `group_key` is never bound, so it always evaluates `false`. (`graphic-asset` is also reused on the balance sheet where group_key *does* feed taproot rendering.)
- No interactions.

### `orc-mint-general-payment-method`

- Source: [mint-general-payment-method.component.ts](../../src/client/modules/mint/modules/mint-general/components/mint-general-payment-method/mint-general-payment-method.component.ts) · [`.html`](../../src/client/modules/mint/modules/mint-general/components/mint-general-payment-method/mint-general-payment-method.component.html)
- Used once per limit row. Parent passes `[payment_method]="limit.method"`. `icon_size` defaults to `'icon-sm'`.
- Switch on `payment_method`:
  - `'bolt11'` ⇒ `<div>BOLT 11</div>` + `mat-icon` `bolt` (the lightning bolt). Live state on every fixture.
  - `'bolt12'` ⇒ `<div>BOLT 12</div>` + `mat-icon[svgIcon=double_bolt]` (custom registered SVG). No fixture publishes this method as of writing.
  - any other string ⇒ raw method text only, no icon. Dead from current daemons.
- No interactions.

### Pipes used in the template

- `localAmount` ([local-amount.pipe.ts](../../src/client/modules/local/pipes/local-amount/local-amount.pipe.ts)) — bound via `[innerHTML]`, returns wrapped `<span class="orc-amount-standard">…</span>` markup. Section is hard-coded `'mint'`. The pipe routes by unit:
  - `sat` / `msat` ⇒ `transformSat` (locale-formatted integer plus the user's BTC unit display, glyph or code)
  - `btc` ⇒ 8-fractional `BTC` string
  - `usd` / `eur` ⇒ `transformFiat`, divides by 100, renders to 2 fractional digits
  - other ⇒ `transformStandard`, locale-formatted integer + raw unit
- The min cell falls back to `1 | localAmount: unit : 'mint'` (literal `1`) when `min_amount` is null — meaning `msat` would render `1 msat` after the integer fallback even though the actual lower bound is unbounded. Quirk worth noting if a non-bolt method ever arrives.

## Unhappy / edge cases

- **`info()` populated but `info.nuts` missing** — the GraphQL schema marks `nuts` non-null, so this would be a client-side bug or stale generated types. `nuts()` falls through to `[]`, both statuses default to `'active'`, both limit arrays empty ⇒ pills lie about minting being on. Fail-loud-vs-fail-silent: this fails silent.
- **`nut4`/`nut5` present but `methods` null** — TS schema marks `methods` non-null but the daemon JSON could in theory drop it; `mapMethodLimits(undefined)` returns `[]`, the column collapses gracefully.
- **`max_amount === 0`** — treated like a normal number: `getTrackWidthPercent` returns `max(5, 0/unit_max*100)` = 5%, so the bar floors to a sliver. `max_by_unit` records 0; if all entries in the unit are 0, the result map has unit→0, and `getTrackWidthPercent` short-circuits to `100` (the `=== 0` guard).
- **A unit in the limits that no `orc-graphic-asset` icon recognises** (e.g. a custom `'cad'`) — the asset disc falls back to `graphic-asset-unknown` and the icon to `question_mark`; no error, but visually flags the gap.
- **Schema gains a new `nutN`** — `nuts()` picks it up automatically (entries filter is `key.startsWith('nut')`). Unknown shapes route through `getNutStatus`'s final fallthrough ⇒ `'enabled'` if any object form, `'disabled'` if `null`/primitive. New chips render without code changes.
- **NUT key not parseable as a number** (e.g. someone introduces `nut4a`) — `parseInt('4a', 10) = 4`, so the chip de-duplicates with the real NUT-04 visually but renders both. Defensive only against future schema drift.
- **`max_amount` huge (e.g. 2^53)** — locale-formatted with `.toLocaleString()`; no overflow in the pipe, but the chip wraps if it exceeds the row width (the column is `flex-1` so it stretches before wrapping).

## Template structure (at a glance)

```
.flex-column
├── "Config" title
└── mat-card
    └── mat-card-content
        ├── chip block
        │   ├── @for (nut of nuts()) → .nut-card  (orc-graphic-status + number)
        │   └── caption: "Supported Nuts"
        ├── pill row
        │   ├── .orc-high-card  →  orc-graphic-status[minting_status] + "Minting enabled|disabled"
        │   └── .orc-high-card  →  orc-graphic-status[melting_status] + "Melting enabled|disabled"
        └── limits row (two flex-1 columns)
            ├── @if (minting_limits().length > 0)
            │     ├── caption: "Minting Limits"
            │     └── @for limit → .orc-high-card
            │           ├── orc-graphic-asset[unit] + orc-mint-general-payment-method[method]
            │           └── .limit-range  →  min · bar · max
            └── @if (melting_limits().length > 0)  …mirror…
```

## Interaction summary

| Gesture | Target | Result |
|---|---|---|
| (none) | — | The component is read-only — no clicks, hovers with side effects, drags, or form inputs. |

## Test-author handoff

### Host page + setup

- Route: `goto('/mint')`. Authenticated; storageState if available, otherwise `loginViaUi`.
- `beforeEach` shape: navigate to `/mint`, wait for the dashboard's mint-info card to mount (sibling tile is the cheap "page settled" probe shared across mint specs), then scope into `page.locator('orc-mint-general-config')`.
- Tag: `@mint`. The card is config-agnostic — every stack mounts it — so it earns `@mint` plus the implicit per-stack tags (`@cdk`, `@nutshell`, `@sqlite`, etc.) added by `tagsFor`. Not part of `@canary` (the canary smoke set is bitcoin/lightning surface).

### Differential oracles

| Input | Backend helper | Notes |
|---|---|---|
| `info.nuts.nut4.methods[].method/unit/min_amount/max_amount` | [`mint.getInfo(config)`](../../e2e/helpers/backend/mint.ts) | Existing helper — returns NUT-06. **Gap**: [`MintNutInfo`](../../e2e/types/mint.ts) is currently narrowed to `name`/`description`/`urls`/etc. and does NOT include `nuts`. Extend the type with `nut4`/`nut5`/`nut19` (mirroring `OrchardNuts` but loosened — `nut19?: object \| null` to model nutshell's `null`) before authoring the spec. |
| `info.nuts.nut5.methods[].…` | `mint.getInfo(config)` | Same gap — NUT-05 lives in the same `nuts` block. |
| `info.nuts.nut4.disabled` / `nut5.disabled` | `mint.getInfo(config)` | Same gap; trivial booleans once the type widens. |
| `info.nuts.nut*.supported` (NUT-07-onwards) | `mint.getInfo(config)` | Same gap. The chip palette test asserts the exact set of chip numbers and the colour bucket (`active` / `enabled` / `disabled`) — both directly readable from the helper. |
| `OrchardNuts` schema shape | n/a | The TS schema in `@shared/generated.types` is the contract; the spec asserts that every key the schema lists shows up as a chip. |

### State reachability matrix

| State | `lnd-nutshell-sqlite` | `lnd-cdk-sqlite` | `cln-cdk-postgres` | `cln-nutshell-postgres` |
|---|---|---|---|---|
| 1. Live cdk (min=1, max=500k, NUT-19/29 enabled, NUT-21/22 grey) | — stack-only | ✓ live | ✓ live | — stack-only |
| 2. Live nutshell (unlimited limits, NUT-19/21/22/29 grey) | ✓ live | — stack-only | — stack-only | ✓ live |
| 3. Minting disabled | — synthetic | — synthetic | — synthetic | — synthetic |
| 4. Melting disabled | — synthetic | — synthetic | — synthetic | — synthetic |
| 5. Both disabled | — synthetic | — synthetic | — synthetic | — synthetic |
| 6. Multiple methods per direction (bolt11+bolt12) | — synthetic | — synthetic | — synthetic | — synthetic |
| 7. Empty `methods` on a direction | — synthetic | — synthetic | — synthetic | — synthetic |
| 8. `info()` null | — synthetic | — synthetic | — synthetic | — synthetic |
| 9. Mixed units (sat + usd) | — fixture-only | — fixture-only | — fixture-only | — fixture-only |

### Per-state probes

The card root locator is `card = page.locator('orc-mint-general-config')`. Every probe below scopes within `card`.

| State | Settled signal | Primary assert |
|---|---|---|
| Card mount | `card.locator('mat-card')` visible | `await expect(card).toBeVisible()` |
| Title | `card.getByText('Config', {exact: true})` | exactly one |
| 1. cdk live | `card.locator('.nut-card')` count = 16; `.limit-range` count = 2 | each chip's number + dot class matches `mint.getInfo()` truth; min cell innerHTML contains `1`, max cell contains `500,000` per row; NUT-21/22 chip dots `orc-outline-variant-bg` |
| 2. nutshell live | same chip count = 16 | NUT-19/21/22/29 chip dots all `orc-outline-variant-bg`; both max cells render literal `∞` |
| 3. Minting disabled | `card.getByText('Minting disabled')` visible | NUT-04 chip's status dot has `orc-status-inactive-bg`; pill text reads `Minting disabled` |
| 4. Melting disabled | `card.getByText('Melting disabled')` visible | mirror over NUT-05 |
| 5. Both disabled | both above | both pills red, both NUT-4/5 dots red |
| 6. Multiple methods | `card.locator('orc-mint-general-payment-method')` count > 2 | one element renders text "BOLT 12" and contains `mat-icon[svgIcon="double_bolt"]` |
| 7. Empty methods | `card.getByText('Minting Limits')` not visible | the whole label + rows block absent on the affected side |
| 8. info null | `card.locator('.nut-card')` count = 0 | both `Minting Limits` / `Melting Limits` labels absent; both pills still render with "enabled" text (documented quirk) |
| 9. Mixed units | each `.limit-range` row's preceding `orc-graphic-asset` carries `graphic-asset-btc` or `graphic-asset-usd` | unit asset class matches the helper's `nut4.methods[i].unit` |

Locator probe verification (run on live cdk during spec authoring, all returned exactly `1`):

```js
document.querySelectorAll('orc-mint-general-config mat-card').length            // 1
Array.from(document.querySelectorAll('orc-mint-general-config .title-l'))
  .filter(e => e.textContent.trim() === 'Config').length                         // 1
document.querySelectorAll('orc-mint-general-config .nut-card').length            // 16
document.querySelectorAll('orc-mint-general-config orc-mint-general-payment-method').length  // 2
document.querySelectorAll('orc-mint-general-config orc-graphic-asset').length    // 2
document.querySelectorAll('orc-mint-general-config .limit-range').length         // 2
```

### Reusable interaction recipes

- **None of the read-only-card recipes apply.** The component has no clicks, hovers, drags, dialogs, or form inputs.
- **InnerHTML pipe assertions** — the min/max cells use `[innerHTML]` so the rendered text is wrapped in `<span class="orc-amount-standard">…</span>`. Use `card.locator('.limit-range-min .orc-amount').textContent()` to read the bare numeric value rather than asserting against the wrapper. Same for `.limit-range-max .orc-amount`.
- **Status dot colour** — the dot's class encodes the status. Probe via `await expect(chip.locator('.indicator-circle')).toHaveClass(/orc-status-inactive-bg/)` instead of computed style — the `*-bg` classes are stable cross-theme.

### Skip taxonomy

| Uncovered state | Tag | Rationale |
|---|---|---|
| Minting disabled / Melting disabled / Both disabled | `fixture-only` | No regtest fixture toggles `nut4.disabled` or `nut5.disabled`. Adding requires either a separate `*-mint-disabled` docker config or a recorded GraphQL fixture; out of scope for the canonical card spec. |
| Multiple methods per direction (bolt11 + bolt12) | `fixture-only` | None of the four stacks publish `bolt12` in the `nuts.nut4.methods` array. cdk's mintd doesn't emit a bolt12 method; nutshell doesn't either. Would need a dedicated bolt12-enabled mintd config. |
| Empty `methods` on a direction | `dead-branch` | Both nutshell and cdk always emit a non-empty methods array on `nut4`/`nut5` when minting/melting is on; an empty methods list with `disabled: false` is implausible from the daemon side. |
| `info()` null | `dead-branch` | The parent only mounts the card after `mintInfoResolver` resolves; on resolver error the dashboard shows its error banner instead of mounting the tile. The null-tolerant `?.` chain in the component is defensive, not reachable here. |
| Unit mix (sat + usd) | `stack-only` | Reachable on `fake-cdk-postgres` (mintd.toml lists `supported_units = ["sat", "usd"]`) but the no-LN, no-bitcoin fake stack isn't part of the e2e mint card matrix today. Gate on `testInfo.project.name` if/when added. |
| `orc-graphic-asset` `eur` / unknown / taproot branches | `dead-branch` from this parent | `eur` not exposed by any fixture, taproot `group_key` never bound here. Cover in `graphic-asset.component.spec.ts`. |
| `orc-mint-general-payment-method` default branch (raw method text, no icon) | `dead-branch` | Daemons emit only `bolt11` / `bolt12`. Cover in `mint-general-payment-method.component.spec.ts`. |
| `getTrackWidthPercent` 5% floor | `unit-better` | Pure function, ratio-edge case — covered by a unit test, not e2e (wouldn't reliably reproduce the exact width without a fixture). |

## Test fidelity hooks

No `mint-general-config.spec.ts` exists yet — this spec is being authored to support writing it.

States the upcoming `mint-general-config.spec.ts` should cover (live-reachable on the fixture matrix):

- **Card mounts on `/mint`** — `mat-card` count = 1, with the "Config" title.
- **Chip set matches the daemon truth** — for each key in `mint.getInfo(config).nuts` whose name starts with `nut`, a chip with the matching number renders, and its dot class matches the status bucket the component would compute. Differential.
- **NUT-04 / NUT-05 pills reflect `disabled`** — read from `mint.getInfo`, assert "Minting enabled|disabled" + "Melting enabled|disabled" text and dot class.
- **Limit rows match `nut4.methods` / `nut5.methods`** — per row, `unit` ⇒ `orc-graphic-asset` class, `method` ⇒ `orc-mint-general-payment-method` text, min cell = `min_amount ?? 1` (locale-formatted), max cell = `max_amount ?? '∞'`.
- **Bar widths scale** — for any unit with multiple rows, the row whose `max_amount` is the largest is at 100%, others at the ratio (or 100% if any row in that unit has `max_amount === null`). Approximate the assertion (within 1%); CSS rounding can shift the value. (Skip for stacks where every unit has only one row — i.e. all current fixtures — as the assertion degenerates.)

States explicitly **not** to cover in the e2e (see *Skip taxonomy* for tags):

- All `disabled: true` paths (NUT-04 / NUT-05) — `fixture-only`.
- BOLT 12 method rendering — `fixture-only`.
- Multi-method bar scaling — covered indirectly by the unit-test assertion on `getTrackWidthPercent` plus a single live row.
- `info()` null — `dead-branch`.

## Notes for implementers

- `OnPush` + signal inputs ⇒ re-renders on any new reference to `info()`. The parent's resolver hands a fresh `MintInfo` instance each navigation, so the card always re-renders cleanly on route change.
- All five computed signals trace back to `info()`, so a single signal write at the parent cascades atomically — no risk of the chip block disagreeing with the limits block mid-frame.
- `max_by_unit` is private; if a future feature needs to surface "the displayed unit max" anywhere else, lift it out of the component instead of re-deriving — the `null`-sticky semantics are subtle and easy to re-implement wrong.
- Bar fills animate via `transition: width 0.3s ease`; resilient to rapid re-binds (no flicker) but means snapshot-based visual tests need to wait one frame after data swap for the bar to settle.
- The component has no `ngOnInit`, no subscriptions, no `ngOnDestroy` — appropriate. Don't introduce lifecycle hooks unless the data contract changes.
