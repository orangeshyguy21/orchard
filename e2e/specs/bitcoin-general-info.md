# `orc-bitcoin-general-info`

Source: [bitcoin-general-info.component.ts](../../src/client/modules/bitcoin/modules/bitcoin-general/components/bitcoin-general-info/bitcoin-general-info.component.ts) · [`.html`](../../src/client/modules/bitcoin/modules/bitcoin-general/components/bitcoin-general-info/bitcoin-general-info.component.html)

## Purpose

The **Info** card on the dashboard (`/`) summarising the state of the local `bitcoind` node backing Orchard. It's a pure presentational container — all data comes from inputs, no service calls, no subscriptions. Its job is to render:

- node identity (chain name + whether it also serves as the Lightning backend)
- a traffic-light state (`online` / `syncing` / `offline`)
- the node's advertised reachable URIs as clickable chips (opens a QR/copy dialog)
- counts: peers, block height, chain weight
- a projected slot (`ng-content`) for an "Open Bitcoin" action button

## Where it renders

- **Only usage**: [`orc-index-subsection-dashboard-bitcoin-enabled`](../../src/client/modules/index/modules/index-subsection-dashboard/components/index-subsection-dashboard-bitcoin-enabled/index-subsection-dashboard-bitcoin-enabled.component.html:5) on the dashboard, left tile of the Bitcoin row.
- Only mounted when `enabled_bitcoin` is true in runtime config AND the parent dashboard has finished loading (`!loading()`).

## Inputs

| Input | Type | Required | Notes |
|---|---|---|---|
| `blockchain_info` | `BitcoinBlockchainInfo \| null` | ✓ | From `bitcoinBlockchainInfo` query. Null before first response. |
| `network_info` | `BitcoinNetworkInfo \| null` | ✓ | From `bitcoinNetworkInfo` query. `.backend=true` means bitcoind is serving a Lightning node on the same box. |
| `blockcount` | `number` | ✓ | Live value (subscription-fed); formatted via `bitcoinGeneralBlock` pipe. |
| `error` | `boolean` | ✓ | True when the parent's `errors_bitcoin[]` is non-empty. |
| `device_type` | `'desktop' \| 'tablet' \| 'mobile'` | ✓ | Passed through to the URI dialog only — does not affect this component's own layout. |
| `connections` | `PublicPort[]` | optional (default `[]`) | Result of port-reachability probes keyed by `host:port`; merged into chip status dots. |

## Outputs & projected content

- No `@Output()`s.
- One `<ng-content>` slot inside the footer flex row — the parent projects the **"Open Bitcoin"** extended FAB (with a mat-menu / bottom-sheet trigger on desktop vs mobile). This component does not own that button.

## Derived / computed signals

- `state` → `'offline' | 'syncing' | 'online'`
  - `error` wins over everything ⇒ `offline`
  - else `blockchain_info.initialblockdownload` ⇒ `syncing`
  - else ⇒ `online`
- `status` → `'inactive' | 'warning' | 'active'` — parallel to `state`, drives the `orc-graphic-status` dot colour.
- `uris` → truncates `network_info.localaddresses[]` into display objects; detects `.onion` ⇒ labelled with first 15 chars + `…onion`.
- `connections_status_map` → `Map<'host:port', connection_status>` for chip dots.

## Happy path

1. Parent mounts this inside `@if (!loading())`, so on first render both `blockchain_info` and `network_info` are populated.
2. The top row shows `{chain}` + optional "Lightning backend" sub-label, with the state dot + state text on the right.
3. Below: URI chips (one per `localaddresses` entry) OR the italic "No connections" fallback.
4. Below: `connections`, `blockcount`, `size_on_disk` as stat rows.
5. Bottom row: chain weight + projected button.
6. Click a URI chip → opens `NetworkConnectionComponent` dialog with QR code + copyable URI + connection-status pill.

## Reachable states

### 1. Online — no URIs, Lightning backend present

Regtest / freshly-started node with no advertised `localaddresses`. Current live state in `lnd-nutshell-sqlite`.

- state dot: green, "online"
- "Lightning backend" sub-label under chain name (because `network_info.backend === true`)
- URI block shows italic *"No connections"*
- counts render normally

### 2. Online — URIs populated (clearnet + Tor mix)

Mainnet / testnet node with advertised reachable addresses.

- each URI becomes a `mat-chip` prefixed with an `orc-network-connection-status` dot
- `.onion` addresses are truncated to `abcd…onion:PORT` (first 15 chars of the onion hostname + `…onion`)
- IPv4 / IPv6 addresses render full
- chip is clickable → QR dialog (see state 6)

### 3. Syncing (IBD in progress)

`blockchain_info.initialblockdownload === true`.

- state dot: amber, text: "syncing"
- all other fields render their current values (headers may still be advancing)
- NOTE: the *parent* also switches its neighbouring tile from "blockchain" (fees + block template) to "syncing" (IBD progress); this info card itself doesn't change structure, only the dot + label.

### 4. Offline (error)

`error === true` (parent's `errors_bitcoin.length > 0`).

- state dot: red, text: "offline"
- cached `blockchain_info` / `network_info` / `blockcount` values continue to render (no blank-out). This is intentional per `AGENTS.md` — show the last-known data, surface the error via the dot, don't wipe the UI.
- chain weight and peers show the last cached numbers.

### 5. No Lightning backend badge

When `network_info.backend === false` (bitcoind not feeding a Lightning node — e.g. standalone node, or dual-node setups where LN runs on a different bitcoind).

- the "Lightning backend" chip-sublabel with the link icon disappears
- chain name row collapses to just the chain text

### 6. URI dialog (opened by clicking a chip)

Rendered by [`NetworkConnectionComponent`](../../src/client/modules/network/components/network-connection/network-connection.component.ts), not by this component — but the click path originates here.

- Title: `Bitcoin {type} connection` where `{type}` is `clearnet` or `tor`
- Status subtitle: `Reachable` / `Unreachable` / `Unknown status` (from `connections_status_map`)
- URI row with `content_copy` button
- Rasterised block-icon QR code (the SVG in `block.svg` is rendered to PNG at 128px via a private `createBlockPng(colour, size)` helper and embedded as the QR's centre graphic)
- Slider (QR module size) + colour toggle
- `Download` + `Close` actions

## Unhappy / edge cases

- **`blockchain_info` null but component rendered** — would render `{{ undefined }}` as empty for chain name, `undefined | dataBytes` for chain weight (likely "—" or empty depending on pipe). In practice the parent gates on `!loading()` so this only happens mid-flight if one query resolves before another.
- **`network_info` null** — URI chip block falls into "No connections" branch; `{{ network_info()?.connections }}` renders as empty next to "Peers" label.
- **`blockcount` missing a subscription update** — stays at the last value; not an error state.
- **`localaddresses` contains non-`.onion` v3-onion-looking strings** — the `.onion` split is naive (`addr.includes('.onion')` + `split('.onion')[0]`). Non-standard onion domains *with additional subdomains* (`foo.bar.abc.onion`) will truncate the first 15 chars of the full subdomain chain, not the onion id proper. Not currently broken because bitcoind never emits nested subdomains in `localaddresses`, but worth noting if bitcoind's output format ever changes.
- **Duplicate URIs** — the `@for` tracks by `connection.uri`; duplicates would collapse to a single chip. bitcoind normally dedupes.
- **Very long IPv6 addresses** — rendered in full without truncation; chip set is marked `orc-column-chip-set` so it wraps to new lines rather than overflows.
- **Projected button missing** — the bottom flex row renders chain-weight-only; no layout break, just empty space where the FAB would sit. Not a real scenario in current usage.

## Template structure (at a glance)

```
.flex-column
├── "Info" title
└── mat-card
    └── mat-card-content
        ├── top row: [deployed_code icon] {chain} / "Lightning backend"?  ·  [status dot] {state}
        ├── URI block: mat-chip-set OR "No connections"
        ├── counts: connections / peers / block height / chain weight
        └── <ng-content/>  (parent projects the "Open Bitcoin" FAB)
```

## Interaction summary

| Gesture | Target | Result |
|---|---|---|
| click URI chip | `(click)` on `mat-chip` | opens `NetworkConnectionComponent` dialog |
| click projected "Open Bitcoin" button | parent FAB with `matMenuTriggerFor` | opens nav menu (desktop) or bottom sheet (mobile) |
| hover chip | `matRipple` on chip | ripple — no state change |

## Test fidelity hooks

The existing e2e spec [`bitcoin-general-info.spec.ts`](./bitcoin-general-info.spec.ts) asserts:

- card renders
- chain name + block height match `bitcoin-cli` output (differential)
- projected "Open Bitcoin" button navigates to `/bitcoin`

States that aren't yet covered by e2e and would be worth adding:

- `offline` rendering when `errors_bitcoin[]` is populated (pause `docker pause bitcoind` in the fixture)
- `syncing` rendering (hard to trigger in regtest — would need a fixture that stalls bitcoind mid-IBD)
- URI chip rendering when `localaddresses[]` is non-empty (regtest doesn't emit any; would need a recorded network_info fixture or a mainnet-config spec)
- URI click → dialog opens with correct `uri` / `type` / `status` wiring

## Notes for implementers

- This is `OnPush` with signal inputs — if a parent passes new class instances each tick (e.g. `new BitcoinBlockchainInfo(...)` rebuilt on every GraphQL poll), the reference inequality will trigger re-render. Keep in mind when considering memoisation up the tree.
- `createBlockPng` runs at click time, not at render; QR dialog open is cheap until the user clicks.
- No internal subscriptions ⇒ no `ngOnDestroy` cleanup required; the class body currently has no lifecycle hooks, and that's appropriate.
