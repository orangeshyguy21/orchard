# `orc-index-subsection-dashboard-bitcoin-enabled-blockchain`

Source: [index-subsection-dashboard-bitcoin-enabled-blockchain.component.ts](../../src/client/modules/index/modules/index-subsection-dashboard/components/index-subsection-dashboard-bitcoin-enabled-blockchain/index-subsection-dashboard-bitcoin-enabled-blockchain.component.ts) · [`.html`](../../src/client/modules/index/modules/index-subsection-dashboard/components/index-subsection-dashboard-bitcoin-enabled-blockchain/index-subsection-dashboard-bitcoin-enabled-blockchain.component.html) · [`.scss`](../../src/client/modules/index/modules/index-subsection-dashboard/components/index-subsection-dashboard-bitcoin-enabled-blockchain/index-subsection-dashboard-bitcoin-enabled-blockchain.component.scss)

## Purpose

The **Blockchain** panel on the dashboard (`/`). It renders a small "mempool-style" visualisation of the tip of the chain: the in-flight block template on the left (the block bitcoind is currently assembling), a vertical divider standing in for the chain boundary, and the most recent confirmed block on the right. An arrow indicator above the template points at either the template itself or the mempool pool to the left of it, based on whether a target fee rate would clear the next block. A horizontal flash animation fires the container each time `block_height` changes, signalling a new tip.

The component is purely presentational — no service calls, no subscriptions. Everything it renders comes from inputs, with two derived values (`target_block`, `mempool_depth`) computed locally. The fee-rate `mat-select` trigger that would emit `target_change` is currently commented out in [the template](../../src/client/modules/index/modules/index-subsection-dashboard/components/index-subsection-dashboard-bitcoin-enabled-blockchain/index-subsection-dashboard-bitcoin-enabled-blockchain.component.html:4-39), so the `target_change` output, `form_group` / `control_name` inputs, and `getSelectedTargetLabel` / `onTargetChange` handlers are wired but unreachable from the UI.

## Where it renders

- **Only usage**: [`orc-index-subsection-dashboard-bitcoin-enabled`](../../src/client/modules/index/modules/index-subsection-dashboard/components/index-subsection-dashboard-bitcoin-enabled/index-subsection-dashboard-bitcoin-enabled.component.html:47) on the dashboard, right tile of the Bitcoin row (the `.panel-blockchain` slot).
- Only mounted when:
  - `enabled_bitcoin` is true (runtime config)
  - the parent dashboard has finished loading (`@if (!loading())`)
  - AND `blockchain_info()?.is_synced === true` — if the node is still in IBD, the sibling `orc-index-subsection-dashboard-bitcoin-enabled-syncing` takes this slot instead.

## Inputs

| Input | Type | Required | Notes |
|---|---|---|---|
| `block` | `BitcoinBlock \| null` | — (default `null`) | From `bitcoinBlock` query. Rendered as the right-hand confirmed block via `orc-bitcoin-general-block`. |
| `block_height` | `number \| null` | — (default `null`) | Live tip height (subscription-fed; the parent passes `blockcount()`). Fed to an `effect()` that triggers `animateFlash()` on every change. |
| `block_template` | `BitcoinBlockTemplate \| null` | — (default `null`) | From `bitcoinBlockTemplate` query. Rendered as the left-hand template block. Also drives `target_block` via its `feerate_low`. |
| `mempool` | `BitcoinTransaction[] \| null` | — (default `null`) | Mempool snapshot. Reduced once in `ngOnInit` into `mempool_depth = ceil(sum(tx.weight) / 4MWU)`. Not re-read on updates — see *Notes for implementers*. |
| `txfee_estimate` | `BitcoinTransactionFeeEstimate \| null` | — (default `null`) | From `bitcoinTxFeeEstimate` query for the currently selected `target`. Drives `target_block` via its `feerate`. |
| `form_group` | `FormGroup` | ✓ | Reactive form owning the `target` control. Wired to the commented-out `mat-select`. Currently unread by the visible template. |
| `control_name` | `string` | ✓ | Name of the target control on the form (always `'target'` at current call sites). Also wired only to the commented-out select. |

All block/template/mempool/estimate inputs are nullable because the parent passes them directly from GraphQL query signals which return `null` before first resolution.

## Outputs & projected content

- `@Output() target_change = new EventEmitter<number>()` — emitted from `onTargetChange(MatSelectChange)`. Currently unreachable from the UI (the emitting `mat-select` is commented out). The parent [still binds it](../../src/client/modules/index/modules/index-subsection-dashboard/components/index-subsection-dashboard-bitcoin-enabled/index-subsection-dashboard-bitcoin-enabled.component.html:55) in case the control is reinstated.
- No `<ng-content>` slots. Layout is entirely self-owned.

## Derived / computed signals

- `target_block` (`computed<number>`) → `0 | 1`. Guard chain in [`getTargetBlock()`](../../src/client/modules/index/modules/index-subsection-dashboard/components/index-subsection-dashboard-bitcoin-enabled-blockchain/index-subsection-dashboard-bitcoin-enabled-blockchain.component.ts:89-96):
  - `txfee_estimate` or `block_template` missing ⇒ `0`
  - `txfee_estimate.feerate` falsy OR `block_template.feerate_low` falsy ⇒ `0`
  - `txfee_estimate.feerate > block_template.feerate_low` ⇒ `0` (selected fee clears the next block)
  - otherwise ⇒ `1` (fee is below the template's floor — tx is expected to sit in the pool)
  - The class drives the indicator's horizontal offset: `next-block` → `right: 5rem`, `pool-block` → `right: 14rem`.
- `mempool_depth` (plain field, not a signal). Calculated once in `ngOnInit` from `mempool()`: `ceil(sum(weight) / 4_000_000)`. Only affects template rendering when `> 1` (a gradient half-block appears left of the template).

## Happy path

1. Parent mounts the component once `blockchain_info.is_synced === true` and GraphQL queries have returned.
2. `ngOnInit` reads `mempool()` once and computes `mempool_depth`; sets `target_options` from [`possible-options.ts`](../../src/client/modules/index/modules/index-subsection-dashboard/components/index-subsection-dashboard-bitcoin-enabled-blockchain/possible-options.ts).
3. `ngAfterViewInit` flips `initialized = true` — the flash effect now fires on subsequent `block_height` changes.
4. Template renders: arrow indicator → template block (`orc-bitcoin-general-block` with `is_template=true`) → vertical divider → confirmed block (`orc-bitcoin-general-block`) → `.block-chained` gradient half fading off the right edge.
5. Each time `blockcount` ticks, the effect fires `animateFlash()`: 200ms fade to `opacity: 0.1`, then 400ms fade back to `1`, cancelling any in-flight animation first.

## Reachable states

### 1. Default — empty template, single-tx tip (regtest live state)

Captured on `lnd-nutshell-sqlite`:
- `block_template`: height 114, `weight: 0`, `nTx: 0`, `feerate_low: 0`
- `block`: height 113, `weight: 888`, `nTx: 1`, recent `time`
- `mempool_depth` = 0, `target_block` = 0

Rendering:
- Arrow indicator positioned above the template block (the `.next-block` class, `right: 5rem`).
- Left card: `~0 sat/vB`, range `0 - 0 sat/vB`, `0 B`, `0 txs`, `~10 min`. No treemap pixels because `nTx = 0`.
- Centre: 0.25rem-wide divider.
- Right card: height label `113` above; body `~0 sat/vB`, `0 - 0 sat/vB`, `249 B`, `1 txs`, `12 minutes ago`.
- Right of block: `.block-chained` gradient half-block fading to transparent.

### 2. Target below template floor — `target_block = 1` (pool indicator)

Override `cmp.target_block = () => 1`. The block-indicator gains `.pool-block` ⇒ `right: 14rem`, shifting the arrow one template-block-width to the left of where it sat in state 1. The arrow now points at the region where the mempool gradient half-block would appear.

In isolation (with `mempool_depth = 0`) the arrow points at empty space — the visual only makes sense alongside state 3.

### 3. Mempool backed up — `mempool_depth > 1`

Override `cmp.mempool_depth = 3`. A `.block-half.block-template` gradient panel (5rem × 10rem, fading left-to-right from `surface-variant` into `surface`, rounded on the right) appears to the left of the template block inside the same flex row. Together with state 2 this is the "tx won't clear the next block" visualisation.

Reproducible by feeding a `mempool` array whose total weight exceeds 4 MWU at mount time. Because `mempool_depth` is computed once in `ngOnInit`, it only reflects the mempool snapshot at first render — later mempool churn does not update the half-block.

### 4. Populated blocks with treemaps

Override `cmp.block_template` and `cmp.block` with non-zero `nTx` values (e.g. 2,435 and 2,100). Each `orc-bitcoin-general-block` now paints a canvas treemap behind the text: a grid of rectangles sized via `generateTreemap(nTx, 128, 128)`. Feerate figures render their actual values (`~500000 sat/vB`, range `500000 - 5000000 sat/vB`, `1.14 MB`, `2,435 txs`). The template still uses the "~10 min" time label, the confirmed block uses a relative age (e.g. "2 years ago") from `block.time`.

### 5. Null inputs — pre-first-data frame

If the component is mounted while `block`, `block_template`, or `txfee_estimate` are still `null`:
- `block_template() || undefined` is passed to the template's `orc-bitcoin-general-block`, so that card renders empty shell (no height header, no body figures, no treemap).
- The confirmed `orc-bitcoin-general-block` renders the height-only header when `block()?.height` is present or nothing when `block()` is null.
- `target_block()` falls back to `0` (guards at the top of `getTargetBlock()`), so the arrow sits above the empty template.
- `mempool_depth` is `0` because `ngOnInit` sees `mempool() === null` or an empty array.

In practice the parent gates on `@if (!loading())` and sets `blockchain_info()?.is_synced` before mounting, but individual queries can still resolve out of order.

### 6. Tip-change flash

When `block_height()` changes after `ngAfterViewInit`, the effect fires `animateFlash()`. The `.blockchain-blocks-container` (`#flash`) animates `opacity: 1 → 0.1` over 200ms (ease-out), then `0.1 → 1` over 400ms (ease-in). Previous animations are cancelled first. Not reachable by override alone — change the input value (e.g. `(() => { cmp.block_height = () => cmp.block_height() + 1; window.ng.applyChanges(cmp); })()`). Triggers every tick the parent's `blockcount()` emits, including the initial non-null value once `initialized = true`.

### 7. Unreachable via UI — `target_change` emission

Calling `cmp.onTargetChange({value: 6} as any)` fires `target_change.emit(6)` and the parent refetches `bitcoinTxFeeEstimate` for target=6. Not reachable from clicks because the `<mat-select>` block is commented out. Included here because the code is still live — any future spec should cover it if the select is restored.

## Unhappy / edge cases

- **`mempool` grows after mount** — `mempool_depth` remains at the `ngOnInit` snapshot. A node that was empty at load but backs up later will still render without the gradient half-block. Only a full component remount updates the value.
- **`block_template.feerate_low === 0`** — falls into the early-return path of `getTargetBlock`, so `target_block` stays at `0` regardless of the fee estimate. This is the regtest default and keeps the indicator pointing at the template instead of floating over empty space.
- **`txfee_estimate.errors` non-null** — the field exists on the class but the visible template does not render it (the fee-rate card is commented out). Errors are effectively swallowed by this component; they'd be surfaced elsewhere if rendered.
- **Extreme feerates (> 1000 sat/vB)** — `bitcoin-general-block` prints the raw number with a `~` prefix, no grouping separators. Values like `~500000 sat/vB` render as a long unbroken string and can overflow the block card on narrow viewports.
- **`block.time` far in the past** — `orc-bitcoin-general-block` formats via a relative-time pipe, so a 2-year-old block shows `"2 years ago"`. No special styling for stale tips.
- **Both blocks null and `form_group` missing** — `form_group` is `input.required()`, so constructing the component without it throws at signal-read time. All call sites pass a valid `FormGroup`, so this is a programmer error.
- **Window resize during flash animation** — `getAnimations()` + `anim.cancel()` handles overlapping frames; no known leak.

## Template structure (at a glance)

```
.flex-column
├── .title-l.invisible "Blockchain"       (reserves layout height; not shown)
└── .blockchain-content
    └── .blockchain-blocks-container  #flash
        └── .flex.flex-gap-1
            ├── .flex-column                             ── TEMPLATE COLUMN ──
            │   ├── .relative
            │   │   └── .block-indicator.[next-block|pool-block]
            │   │       └── arrow_drop_down
            │   └── .flex.flex-gap-1
            │       ├── .block-half.block-template       (if mempool_depth > 1)
            │       └── orc-bitcoin-general-block [is_template=true]
            ├── .w-0-25                                  ── DIVIDER ──
            │   └── .blockchain-divider
            └── .flex.flex-gap-1                         ── CONFIRMED COLUMN ──
                ├── orc-bitcoin-general-block
                └── .block-half.block-chained            (always rendered)
```

## Interaction summary

| Gesture | Target | Result |
|---|---|---|
| (none user-facing today) | — | The visible template has no handlers bound. The block cards are not interactive. |
| `onTargetChange(MatSelectChange)` [programmatic] | component method | Emits `target_change` with the selected `target` number. Only reachable from code while the `mat-select` is commented out. |
| `block_height` input change | effect → `animateFlash()` | Fades the block container to 0.1 opacity and back. Cancels any pending animation first. |

## Test fidelity hooks

[`bitcoin-blockchain.spec.ts`](./bitcoin-blockchain.spec.ts) (`@canary`, runs on `lnd-nutshell-sqlite`) asserts: panel renders both blocks + divider, `.blockchain-blocks-container` flash target is present, arrow indicator carries `.next-block` and not `.pool-block` (regtest template has `feerate_low = 0`), confirmed block's height / byte size / tx count match `bitcoin-cli getblockcount` and `getblock <hash> 2`, template block prints `~10 min`, empty regtest mempool produces no `.block-half.block-template` backup slot, and `.block-half.block-chained` is always rendered. The karma unit spec at the component path only asserts construction.

States NOT yet covered by the e2e spec:

- Tip-change flash fires when a new block is mined (`bitcoin-cli generatetoaddress 1 <addr>` and watch the opacity transition land).
- `.pool-block` indicator rendering when `txfee_estimate.feerate < block_template.feerate_low` (requires a fixture with a non-zero template floor — not reachable in vanilla regtest).
- `mempool_depth > 1` half-block appears when the mempool sum exceeds 4 MWU at mount time.
- Commented-out target select path: none worth covering until the select is restored.

## Notes for implementers

- **`mempool_depth` is not reactive.** It's a plain field computed once in `ngOnInit`, not a `computed()`. If/when the parent starts passing a live mempool signal that should drive depth changes, rewrite as `computed(() => …)` or `effect(() => this.mempool_depth = …)`. Same applies to `target_options`.
- **`target_block` IS reactive** because it's a `computed()` over signal inputs. Overriding it for tests requires reassigning the function on the instance (`cmp.target_block = () => 1`) and calling `window.ng.applyChanges(cmp)`.
- **`animateFlash` depends on `initialized`** (set in `ngAfterViewInit`) so the effect's first run during construction does not animate. The guard is load-bearing — without it, `this.flash.nativeElement` is undefined and the animation throws.
- **OnPush + signal inputs.** A parent that rebuilds `BitcoinBlock` / `BitcoinBlockTemplate` instances each GraphQL poll will re-render on reference inequality even when values are unchanged. Acceptable today (polls are seconds-apart), but a memoisation layer up the tree would reduce wasted rendering.
- **The commented-out fee-rate form is still wired.** `form_group` / `control_name` / `target_change` / `onTargetChange` / `getSelectedTargetLabel` / `target_options` all exist for the commented block. Either restore the select or strip the dead code — leaving it in two states invites drift.
- **Fixed pixel offsets in SCSS.** `.next-block { right: 5rem }` and `.pool-block { right: 14rem }` are calibrated to the width of the block card (10rem) and the optional template half (5rem) + gap. If `orc-bitcoin-general-block` ever changes its intrinsic width, these offsets need to move in lockstep.
