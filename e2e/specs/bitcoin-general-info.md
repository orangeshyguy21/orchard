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

Clicking a chip calls `onUriClick(uri)` ([bitcoin-general-info.component.ts:73](../../src/client/modules/bitcoin/modules/bitcoin-general/components/bitcoin-general-info/bitcoin-general-info.component.ts#L73)), which rasterises the block SVG into a 128px PNG via `createBlockPng('#000000')` and opens `NetworkConnectionComponent` with a `NetworkConnection` payload. See the dedicated **Child components → `orc-network-connection` (URI dialog)** section below for a full enumeration of reachable dialog states, interactions, and the parent-supplied data contract.

## Child components

### `orc-network-connection` (URI dialog)

Opened by `onUriClick(uri)` when the user clicks a URI chip. Rendered inside a `MatDialog` overlay.

- Source: [network-connection.component.ts](../../src/client/modules/network/components/network-connection/network-connection.component.ts) · [`.html`](../../src/client/modules/network/components/network-connection/network-connection.component.html)
- Data type: [`NetworkConnection`](../../src/client/modules/network/types/network-connection.type.ts) — injected via `MAT_DIALOG_DATA`.

#### Parent → child data contract

The parent passes a plain object built in `onUriClick` ([bitcoin-general-info.component.ts:75-86](../../src/client/modules/bitcoin/modules/bitcoin-general/components/bitcoin-general-info/bitcoin-general-info.component.ts#L75)):

| Field | Source | Value for this parent |
|---|---|---|
| `uri` | `uri.uri` | `"{address}:{port}"` — full host:port, even when the chip label is truncated to an onion short form |
| `type` | `uri.type` | `'clearnet'` or `'tor'` — never `'insecure'` (that branch of the child's icon `computed` is unreachable from this parent) |
| `label` | `uri.label` | The displayed chip label (may be truncated onion) — child doesn't render it in this parent's usage but the contract passes it |
| `image` | `await this.createBlockPng('#000000')` | PNG data-URI of the block icon, hard-coded to `#000000` (fill colour is not themed here — compare to the Lightning sibling which uses the LN node's alias colour) |
| `name` | literal | `'bitcoin_node'` — used only as the filename prefix on download (`bitcoin_node_qr.png`) |
| `section` | literal | `'bitcoin'` — rendered in the dialog title via `titlecase` → "Bitcoin …" |
| `status` | `connections_status_map().get(uri.uri)` | `'active' \| 'inactive' \| 'warning' \| null` — status-probe result keyed by `host:port`; `null` when the probe hasn't reported (or the map miss) |
| `device_type` | `device_type()` | `'desktop' \| 'tablet' \| 'mobile'` — used by the child to pick QR size (see states) |

#### Child inputs / outputs / signals

- No `@Input()`s — all data arrives via `MAT_DIALOG_DATA`.
- No `@Output()`s — dialog closure is handled by Material's `mat-dialog-close`.
- `qr_canvas` — `viewChild<ElementRef>` that receives the `QRCodeStyling` DOM node in `ngAfterViewInit`.
- `qr_options` — reactive `FormGroup` with two controls:
  - `style` — `'0' | '1' | '2' | '3'` (slider, required, initial `'0'`)
  - `image` — `boolean` (slide toggle, required, initial `true`)
- `size` computed → `295` if `data.device_type === 'mobile'`, else `395`. Read at QR init time and used both as `[style.max-width]` on the URI row and as the QR canvas width/height.
- `status_message` computed → maps `data.status` to a human label: `'active'` → `"Publicly reachable"`, `'inactive'` → `"Not reachable"`, `'warning'` → `"API offline"`, anything else (including `null`) → `"Unknown status"`.

#### Reachable child states

Every state below was verified live by overriding the child's `data` + `status_message` signals on the open dialog and reapplying change detection.

##### `active` — publicly reachable

- Title: `Bitcoin clearnet connection` (or `Bitcoin tor connection`)
- Subtitle: `Publicly reachable`
- Status icon (rendered by [`orc-network-connection-status`](../../src/client/modules/network/components/network-connection-status/network-connection-status.component.ts)) tinted with `orc-status-active-color` (green).

##### `inactive` — not reachable

- Subtitle: `Not reachable`
- Status icon tinted `orc-status-inactive-color` (red).

##### `warning` — API offline

- Subtitle: `API offline`
- Status icon tinted `orc-status-warning-color` (amber).

##### `null` / unknown

- Subtitle: `Unknown status`
- Status icon falls to `orc-outline-color` (muted/grey). This is the path taken when the status-probe service hasn't yet reported a result for `host:port`.

##### Type variant: `clearnet` vs `tor`

- `data.type === 'tor'` — child's `icon` computed returns `'vpn_lock_2'` but the template's status component switches to `svgIcon="tor"` for tor, rendering the Tor onion glyph. Title reads `Bitcoin tor connection`.
- `data.type === 'clearnet'` — globe + padlock glyph (`vpn_lock_2`). Title reads `Bitcoin clearnet connection`.
- `data.type === 'insecure'` — supported by the status component (`icon === 'language'`, bare globe) but unreachable from this parent. `transformAddress()` only emits `'tor'` or `'clearnet'`.

##### QR style slider (`qr_options.style`)

Four discrete values with distinct dot + corner-square shapes (from `dot_options` / `corner_squre_options` in the child, [network-connection.component.ts:51-62](../../src/client/modules/network/components/network-connection/network-connection.component.ts#L51)):

| Value | Dots | Corner squares | Visual |
|---|---|---|---|
| `'0'` *(default)* | `extra-rounded` | `extra-rounded` | softest, blob-like dots with pill corners |
| `'1'` | `rounded` | `extra-rounded` | slightly squarer dots, pill corners |
| `'2'` | `classy` | `square` | angular classy dots, square corners |
| `'3'` | `square` | `square` | pure pixel-style QR |

Moving the slider fires `onStyleChange()` which calls `qr_code.update({...})`; the QR re-rasterises in place without recreating the dialog.

##### QR image toggle (`qr_options.image`)

- `true` *(default)* — centre 30%-sized PNG (the parent-supplied block glyph) is embedded in the QR, with `hideBackgroundDots: true` clearing the area around it.
- `false` — toggle off calls `onImageChange({checked: false})` → `qr_code.update({image: undefined})`; the centre graphic disappears and the underlying dots repaint through, yielding a plain QR.

##### Device size variants

- `device_type === 'mobile'` → QR canvas 295×295, URI row capped to `max-width: 295px` (wraps long URIs sooner).
- `device_type === 'desktop'` or `'tablet'` → 395×395.

`size` is computed once at init; changing `data.device_type` after the dialog is open does NOT resize the QR (the canvas dimensions are set at `initQR()` in `ngAfterViewInit`).

#### Child interactions

| Gesture | Target | Result |
|---|---|---|
| copy URI | `orc-button-copy` wrapping `.mega-string` | copies `data.uri` to clipboard via the shared copy-button service |
| drag slider | `mat-slider[matSliderThumb]` bound to `qr_options.style` | fires `onStyleChange()` → `qr_code.update({dotsOptions, cornersSquareOptions})` |
| toggle image | `mat-slide-toggle` bound to `qr_options.image` | fires `onImageChange($event)` → `qr_code.update({image: event.checked ? data.image : undefined})` |
| click **Download** | `button[mat-stroked-button][mat-dialog-close]` | calls `qr_code.download({name: '{data.name}_qr', extension: 'png'})` (so `bitcoin_node_qr.png`) AND closes the dialog (the `mat-dialog-close` directive fires in the same click) |
| click **Close** | `button[mat-button][mat-dialog-close]` | closes the dialog via MatDialog overlay backdrop |
| click backdrop / press `Esc` | Material overlay | default MatDialog dismissal |

#### How the dialog closes + what propagates back

The dialog returns no value to the parent. The parent does not subscribe to `afterClosed()` — state in the parent card is unaffected by dialog lifecycle. Reopening the same chip rebuilds the block PNG and reopens a fresh dialog instance.

#### Further-nested children

- `orc-network-connection-status` (title glyph) — specced inline above. No further interactions; pure presentational status dot.
- `orc-button-copy` (URI copy) — shared copy-button component with its own ripple + transient "copied" confirmation. Not enumerated here.

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
| click URI chip | `(click)` on `mat-chip` | `onUriClick()` → rasterises block PNG → opens `NetworkConnectionComponent` dialog |
| click projected "Open Bitcoin" button | parent FAB with `matMenuTriggerFor` | opens nav menu (desktop) or bottom sheet (mobile) |
| hover chip | `matRipple` on chip | ripple — no state change |
| copy URI *(inside `orc-network-connection`)* | `orc-button-copy` | copies full `data.uri` to clipboard |
| drag QR style slider *(inside `orc-network-connection`)* | `mat-slider` | `onStyleChange()` swaps dot + corner-square types (`0`→`3`) |
| toggle QR image *(inside `orc-network-connection`)* | `mat-slide-toggle` | `onImageChange()` adds/removes the centre block glyph |
| click Download *(inside `orc-network-connection`)* | stroked button | `qr_code.download({name: 'bitcoin_node_qr'})` + closes dialog |
| click Close *(inside `orc-network-connection`)* | text button | closes dialog (no return value) |

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

Child-component states skipped by the current e2e spec (see `Child components → orc-network-connection`):

- Dialog `status_message` variants (`Publicly reachable` / `Not reachable` / `API offline` / `Unknown status`) — requires status-probe results in the fixture for a chip's `host:port`
- `data.type === 'tor'` icon (the Tor `svgIcon`) — regtest never emits onion addresses, so the tor icon path only renders via synthetic data
- QR style slider (`0`-`3`) + image toggle round-trip — QR rasterisation is timing-sensitive; the live e2e notes already call this out as a timing liability
- Download behaviour (`qr_code.download()`) — writes a file, better covered by a unit test than an e2e (`network-connection.component.spec.ts` already tests the download handler)
- `device_type === 'mobile'` QR size (295) — requires the dashboard to render under a mobile viewport before opening the dialog

## Notes for implementers

- This is `OnPush` with signal inputs — if a parent passes new class instances each tick (e.g. `new BitcoinBlockchainInfo(...)` rebuilt on every GraphQL poll), the reference inequality will trigger re-render. Keep in mind when considering memoisation up the tree.
- `createBlockPng` runs at click time, not at render; QR dialog open is cheap until the user clicks.
- No internal subscriptions ⇒ no `ngOnDestroy` cleanup required; the class body currently has no lifecycle hooks, and that's appropriate.
