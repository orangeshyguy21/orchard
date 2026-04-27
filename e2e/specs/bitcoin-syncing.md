# `orc-index-subsection-dashboard-bitcoin-enabled-syncing`

Source: [`index-subsection-dashboard-bitcoin-enabled-syncing.component.ts`](../../src/client/modules/index/modules/index-subsection-dashboard/components/index-subsection-dashboard-bitcoin-enabled-syncing/index-subsection-dashboard-bitcoin-enabled-syncing.component.ts) · [`.html`](../../src/client/modules/index/modules/index-subsection-dashboard/components/index-subsection-dashboard-bitcoin-enabled-syncing/index-subsection-dashboard-bitcoin-enabled-syncing.component.html)

## Purpose

The **Syncing** card on the dashboard (`/`), shown in place of the blockchain/mempool tile while bitcoind is in initial block download (IBD). It's a pure presentational container — both inputs flow in from the parent's GraphQL queries, and it makes no service calls. Its job is to render:

- a 200px progress ring whose fill mirrors `verificationprogress`
- the percentage as the ring's centre label
- a five-row info table (Date · Block height · Best block · Log2 work · Target height) that flashes briefly each time a row's value changes, so the operator can see the chain advancing in real time

## Where it renders

- **Only usage**: [`orc-index-subsection-dashboard-bitcoin-enabled`](../../src/client/modules/index/modules/index-subsection-dashboard/components/index-subsection-dashboard-bitcoin-enabled/index-subsection-dashboard-bitcoin-enabled.component.html:42), right tile of the Bitcoin row.
- Mounted only when the parent dashboard has loaded (`!loading()`) **and** `blockchain_info()?.is_synced === false`. Once `is_synced` flips true the parent swaps in [`orc-index-subsection-dashboard-bitcoin-enabled-blockchain`](./bitcoin-blockchain.md) and this card unmounts.
- `is_synced` is the `BitcoinBlockchainInfo` getter `!initialblockdownload && headers === blocks` ([bitcoin-blockchain-info.class.ts:19](../../src/client/modules/bitcoin/classes/bitcoin-blockchain-info.class.ts#L19)). Either flag flipping back (e.g. a re-org that widens `headers - blocks`, or a node that re-enters IBD) re-mounts this card.

## Inputs

| Input | Type | Required | Notes |
|---|---|---|---|
| `blockchain_info` | `BitcoinBlockchainInfo \| null` | optional (default `null`) | From `bitcoinBlockchainInfo` query. Drives `verificationprogress` (ring), `headers` (Target height row), and the IBD gate via `is_synced`. |
| `block` | `BitcoinBlock \| null` | optional (default `null`) | From `bitcoinBlock` subscription/query. Supplies `time` / `height` / `hash` / `chainwork` for the four block-driven rows. Null until the first response — null inputs render empty cells (see Edge cases). |

## Outputs & projected content

- No `@Output()`s.
- No `<ng-content>` slots — the layout is entirely owned by this component.

## Derived / computed signals

- `sync_progress` — `computed(() => verificationprogress * 100)`. Returns `0` when `blockchain_info` is null. Bound to `[value]` on the `<orc-progress-circle>`. The ring's max is `100`, so a 0.9146 verificationprogress paints as 91.46% fill.

## Internal state (not signals)

- `polling_block: boolean` — flag toggled to `true` 1s after `ngOnInit` (only when the node is not yet synced — see [the gate at `pollingBlock()`](../../src/client/modules/index/modules/index-subsection-dashboard/components/index-subsection-dashboard-bitcoin-enabled-syncing/index-subsection-dashboard-bitcoin-enabled-syncing.component.ts#L67)). All five `animate*` helpers early-return unless `polling_block` is `true`. This suppresses the flash on the very first paint (otherwise every value would flash on initial render) and only enables flashes for *subsequent* updates.
- `previous_values` — last-seen `{height, time, hash, chainwork, headers}`. Compared against the new values inside the constructor's `effect()`; any field whose value changed gets a fade-down/fade-up animation on its corresponding `#flash_*` element. The ring fill itself is animated by Material's progress-spinner, not by this component.

## Happy path

1. Parent gates on `!blockchain_info()?.is_synced`, so this card only mounts during IBD. On first render `blockchain_info` and `block` are already populated.
2. Ring paints to `verificationprogress * 100`% with the percentage as the centre label.
3. Five info rows fill from `block` (Date · Block height · Best block · Log2 work) and `blockchain_info.headers` (Target height).
4. After 1 s, `polling_block` flips to `true`. Every subsequent `block` / `blockchain_info` update fires the constructor's `effect()`: any field whose value changed runs a 200 ms fade-down to `opacity: 0.1` followed by a 400 ms fade-up to `opacity: 1` on its `#flash_*` element. Height has two `#flash_height_*` targets — the percentage label inside the ring and the `Block height` table cell — so a new block flashes both in sync.
5. When the node finishes IBD, the parent flips to the `@else` branch and this component unmounts. There is no internal "synced" state.

## Reachable states

### 1. Mid-IBD (synthetic — `verificationprogress = 0.9146`)

Captured by overriding `blockchain_info` on the parent component to set `initialblockdownload: true`, `blocks: 911 863`, `headers: 946 819`, `verificationprogress: 0.9146`, plus a matching `block` payload.

- Ring filled ~91% with `91.46%` centre label
- Date renders via `localTime: 'medium'` (`Aug 26, 2025, 4:43:42 PM` for the synthetic timestamp)
- Block height renders via `bitcoinGeneralBlock` pipe (thin-space-grouped: `911 863`)
- Best block hash truncated by `dataTruncate: 60 : 27 : 10` (`00000000000000000002155fa71…9024cc85c5`)
- Log2 work derived by `bitcoinGeneralLog2work` from chainwork (`79.223739`)
- Target height: `946 819`

### 2. Early IBD — small fill (synthetic — `verificationprogress = 0.0013`)

`blocks: 1 240`, `headers: 946 819`, block at the genesis-era timestamp (`Jan 8, 2009, 7:54:25 PM`).

- Ring shows a thin `0.13%` slice; the muted background ring dominates the visual
- Block height row reads `1 240`; Target height `946 819` — large gap visible between `block.height` and `blockchain_info.headers`
- Best block, Log2 work fields populate from the synthetic block; nothing else changes structurally

### 3. Near-complete with null block (synthetic — `block = null`)

`verificationprogress: 0.9999987`, `blocks: 946 818`, `headers: 946 819`, `block: null`. Demonstrates the parent emitting `blockchain_info` before the `block` query resolves.

- Ring shows full fill, centre label rounds to `100%` (the `percent: '1.0-2'` pipe formats `0.9999987` as `100%` even though `is_synced` is still false because `headers !== blocks`)
- Date, Block height, Best block cells render empty (the `?.` chain returns undefined; `bitcoinGeneralBlock` and `dataTruncate` both pass empty strings through)
- Log2 work reads `0` — `bitcoinGeneralLog2work` returns `0` for any falsy chainwork
- Target height still reads `946 819` because that row reads from `blockchain_info`, not `block`

### 4. Both inputs null (degenerate)

Synthetic: parent emits `blockchain_info: null` and `block: null` while still mounting the component (would require bypassing the parent's `is_synced` gate, since `null?.is_synced` evaluates falsy and would still satisfy `!blockchain_info()?.is_synced`).

- Ring `value` is `0` (the `sync_progress` computed early-returns 0)
- Centre label renders empty (`null | percent` → empty string)
- All five rows render empty cells; structure remains intact
- The `effect()` early-returns (`if (!block && !info) return;`) so no flashes fire

### 5. Flash on update (transient)

Once `polling_block === true` (1 s after mount), any change to `block.time` / `block.height` / `block.hash` / `block.chainwork` / `blockchain_info.headers` triggers the corresponding `#flash_*` element to fade to `opacity: 0.1` over 200 ms, then back to `opacity: 1` over 400 ms (`ease-out` then `ease-in`). The animation cancels any in-flight animation on the same element via `getAnimations()` + `anim.cancel()`, so a rapid succession of updates collapses cleanly without overlap. `polling_block` remains `true` for the lifetime of the component instance — there's no re-arming.

## Child components

### `orc-progress-circle`

Source: [progress-circle.component.ts](../../src/client/modules/progress/components/progress-circle/progress-circle.component.ts) · [`.html`](../../src/client/modules/progress/components/progress-circle/progress-circle.component.html)

A two-spinner sandwich: a fully-filled determinate `mat-progress-spinner` painted as the muted background ring, and a second determinate spinner stacked over it carrying the live `value`. Centre slot is `<ng-content>`; this parent projects the percentage label (`#flash_height_one`).

#### Parent → child data contract

| Input | Value passed by this parent | Notes |
|---|---|---|
| `value` | `sync_progress()` (`0`–`100`) | Required. Bound directly to the foreground spinner's `[value]`. |
| `diameter` | `200` | Pixel diameter of both spinners. |
| `stroke_width` | `20` | Stroke width on both spinners. |
| `progress_color` | (default `''`) | Not overridden — foreground inherits Material's primary palette (the cream/beige seen live). |
| `background_color` | (default `'orc-background-progress-spinner'`) | Not overridden — background ring uses the dark-grey muted track. |

The child is purely presentational: no inputs are reactive in the spinner itself, and there are no outputs or interactions. It does not own the centre label — that's owned by this parent and is what the `effect()` flashes.

## Unhappy / edge cases

- **`block` null but `blockchain_info` populated**: Date / Block height / Best block render empty; Log2 work reads `0` (per `bitcoinGeneralLog2work`); Target height still renders. This is the genuine first-paint state on a fresh dashboard load — the two queries don't resolve in lockstep.
- **`blockchain_info` null but `block` populated**: ring stays at 0% / empty centre label; Target height empty; the four block-driven rows still populate. The `is_synced`-based parent gate makes this mount-state hard to reach in practice (`null?.is_synced` is falsy ⇒ `!falsy` ⇒ true, so the component would mount), but the component degrades cleanly.
- **`verificationprogress > 1`** (impossible from bitcoind but worth noting): `sync_progress` would exceed 100, but `mat-progress-spinner` clamps internally; centre label would read e.g. `120%` because the `percent` pipe doesn't clamp. No protective code in this component.
- **Negative `chainwork`** (impossible — bitcoind emits hex): `bitcoinGeneralLog2work` calls `Math.log2(parseInt(chainwork, 16))` and returns the rounded result; for unparseable values `parseInt` returns `NaN` and `Math.log2(NaN)` is `NaN`, which would render as `NaN` in the cell. Not currently reachable in production.
- **Rapid updates faster than 600 ms**: each new value cancels the in-flight animation on the same `#flash_*` element via `for (const anim of element.getAnimations()) anim.cancel()`, so the next fade starts cleanly from `opacity: 1`. No queue, no piling-up.
- **Component unmounted mid-flash**: the `.animate(...).finished` chain has a `.catch(() => {})` so a cancellation thrown by Angular's destroy doesn't surface; the chained `.finally(() => element.animate(...))` may still fire on the now-detached node but is a no-op visually.
- **`block.time` is a Unix integer** (per server contract): the `localTime: 'medium'` pipe expects this and renders the local-zone medium-format date.
- **`pollingBlock()` race**: if the node finishes IBD inside the first 1 s after this component mounts, the parent unmounts before `polling_block` flips. No flashes ever fire — by design.

## Template structure (at a glance)

```
.bitcoin-syncing-container
├── .title-l "Syncing"
└── .p-t-1
    └── .flex.flex-gap-1
        ├── orc-progress-circle [value=sync_progress(), diameter=200, stroke_width=20]
        │   └── #flash_height_one  →  {{ verificationprogress | percent: '1.0-2' }}
        └── .orc-info-table
            └── table > tbody
                ├── tr  Date            #flash_time       block?.time | localTime: 'medium'
                ├── tr  Block height    #flash_height_two block?.height | bitcoinGeneralBlock
                ├── tr  Best block      #flash_hash       block?.hash | dataTruncate: 60 : 27 : 10
                ├── tr  Log2 work       #flash_chainwork  block?.chainwork | bitcoinGeneralLog2work
                └── tr  Target height   #flash_headers    blockchain_info?.headers | bitcoinGeneralBlock
```

## Interaction summary

| Gesture | Target | Result |
|---|---|---|
| (none) | — | The card has no interactive elements. No clicks, hovers, focus traps, dialogs, or menus are wired. The percentage label projected into the progress circle is plain text. |

## Test fidelity hooks

The e2e spec lives at `e2e/specs/bitcoin-syncing.spec.ts`. The Karma unit spec [`index-subsection-dashboard-bitcoin-enabled-syncing.component.spec.ts`](../../src/client/modules/index/modules/index-subsection-dashboard/components/index-subsection-dashboard-bitcoin-enabled-syncing/index-subsection-dashboard-bitcoin-enabled-syncing.component.spec.ts) currently only asserts component creation.

The wrinkle for e2e: every shipped docker stack starts with bitcoind already in a fully-synced regtest state, so this card is **never live** in the default fixture. The spec **skips when the chain is synced** — each `test()` reads `bitcoind getblockchaininfo` directly via `btc.getBlockchainInfo(config)` in its body and calls `test.skip(is_synced, ...)` before any UI assertion. Cheap to write, zero false positives. The trade-off is that on a vanilla regtest stack the spec never actually exercises render logic — it'll only run when an operator (or a future fixture) starts the stack from a partially-synced state, e.g. by pointing bitcoind at an external mainchain peer (`compose.mainchain.yml`).

States not yet covered by any test that would be worth asserting:

- Ring percentage matches `verificationprogress * 100` (boundary cases: 0%, ~50%, 99.99%, 100% with `headers !== blocks`)
- All five table rows populate from the right input source (`block` for four, `blockchain_info.headers` for one)
- Empty rendering when `block` is null but `blockchain_info` is populated (the genuine first-paint state)
- Flash animation arms only after the 1 s `pollingBlock` delay (initial render values must NOT flash)
- Hash truncation matches `dataTruncate: 60 : 27 : 10` exactly (head 27 chars + ellipsis + tail 10 chars)
- Log2 work renders `0` for null `chainwork` (regression guard against the falsy short-circuit)

## Notes for implementers

- `OnPush` with signal inputs — re-renders only when input identity changes. The parent rebuilds `BitcoinBlockchainInfo` and `BitcoinBlock` instances per GraphQL response, so reference inequality drives both the template re-render and the `effect()` re-run.
- The `effect()` runs in the constructor's injection context, so it auto-cleans on component destroy. No subscription bookkeeping needed.
- `polling_block` is a plain field (not a signal) and is read inside `animate*()` helpers that fire from inside the `effect()`. It does **not** trigger re-renders by itself; the only reason it changes anything visible is that the field-flip is followed by `cdr.detectChanges()` inside the 1 s timeout.
- The two ViewChild references for height (`flash_height_one`, `flash_height_two`) are intentional — the percentage label inside the ring and the table-row value are separate DOM nodes both driven by `block.height` (the percent label is `verificationprogress`, but is in the same animation group). When refactoring, keep them in lockstep.
- `getAnimations()` + `anim.cancel()` is the correct mechanism for cancelling in-flight Web Animations. Don't switch to CSS transitions here without re-deriving the cancellation semantics.
- No SCSS file content — `.scss` exists but is empty. Layout is owned entirely by global helper classes (`flex`, `flex-gap-1`, `orc-info-table`, `font-size-l`, etc.) and the `bitcoin-syncing-container` class which is defined globally. Don't add bespoke styles here unless the design diverges from the rest of the dashboard.
