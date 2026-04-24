# `orc-lightning-general-info`

Source: [lightning-general-info.component.ts](../../src/client/modules/lightning/modules/lightning-general/components/lightning-general-info/lightning-general-info.component.ts) · [`.html`](../../src/client/modules/lightning/modules/lightning-general/components/lightning-general-info/lightning-general-info.component.html)

## Purpose

The **Info** card on the dashboard (`/`) summarising the state of the local Lightning node backing Orchard. It's a pure presentational container — all data comes from inputs, no service calls, no subscriptions. Its job is to render:

- node identity (coloured dot + alias + whether the node also serves as the Cashu mint backend)
- a traffic-light state (`online` / `syncing` / `offline`)
- the node's advertised reachable URIs as clickable chips (opens a QR/copy dialog)
- counts: peers, open channels (active + inactive)
- a projected slot (`ng-content`) for an "Open Lightning" action button

## Where it renders

- **Only usage**: [`orc-index-subsection-dashboard-lightning-enabled`](../../src/client/modules/index/modules/index-subsection-dashboard/components/index-subsection-dashboard-lightning-enabled/index-subsection-dashboard-lightning-enabled.component.html:5) on the dashboard, left tile of the Lightning row.
- Only mounted when `enabled_lightning` is true in runtime config AND the parent dashboard has finished loading (`!loading()`).

## Inputs

| Input | Type | Required | Notes |
|---|---|---|---|
| `lightning_info` | `LightningInfo \| null` | ✓ | Populated from `lightningInfo` query via `LightningService.loadLightningInfo()`. Null before first response. `.backend=true` means this LN node is feeding a local Cashu mint. |
| `error` | `boolean` | ✓ | True when the parent's `errors_lightning[]` is non-empty. |
| `device_type` | `'desktop' \| 'tablet' \| 'mobile'` | ✓ | Passed through to the URI dialog only — does not affect this component's own layout. |
| `connections` | `PublicPort[]` | optional (default `[]`) | Result of port-reachability probes keyed by `host:port`; merged into chip status dots. |

## Outputs & projected content

- No `@Output()`s.
- One `<ng-content>` slot inside the footer flex row (to the right of the "Channels" count) — the parent projects the **"Open Lightning"** extended FAB with `[routerLink]="['/lightning']"`. This component does not own that button.

## Derived / computed signals

- `syncing` → `boolean` — `!lightning_info.synced_to_chain || !lightning_info.synced_to_graph` (treats `null` lightning_info as syncing because of optional chaining).
- `state` → `'offline' | 'syncing' | 'online'`
  - `error` wins over everything ⇒ `offline`
  - else `syncing` ⇒ `syncing`
  - else ⇒ `online`
- `status` → `'inactive' | 'warning' | 'active'` — parallel to `state`, drives the `orc-graphic-status` dot colour.
- `open_channels` → `num_active_channels + num_inactive_channels` (with `?? 0` fallbacks; does **not** include `num_pending_channels`).
- `uris` → maps `lightning_info.uris[]` through `transformUri()` into `{uri, type, label}` display objects:
  - splits on `@` to get `pubkey` and `address`
  - truncates pubkey to first 11 chars
  - if address contains `.onion`, type is `'tor'` and address renders as `{first7chars}...onion:{port}`
  - otherwise type is `'clearnet'` and address renders in full
  - final label is `{truncated_pubkey}...@{truncated_address}`
- `connections_status_map` → `Map<'host:port', connection_status>` derived from the `connections` input; used by chip dots and the dialog.

## Happy path

1. Parent mounts this inside `@if (!loading())`, so on first render `lightning_info` is populated.
2. The top row shows a coloured dot (from `lightning_info.color`) + alias, with optional "Mint backend" sub-label beneath, and the state dot + state text on the right.
3. Below: one chip per URI in `lightning_info.uris[]`, each prefixed with an `orc-network-connection-status` icon whose dot colour comes from `connections_status_map.get(address)`.
4. Below that: the static "Connections" label.
5. Next: `num_peers` with "Peers" label.
6. Bottom row: open channel count with "Channels" label, followed by the projected FAB.
7. Click a URI chip → opens `NetworkConnectionComponent` dialog with QR code, copyable URI, and a rasterised coloured-circle centre graphic.

## Reachable states

### 1. Online — single clearnet URI, Mint backend present

Current live state in `lnd-nutshell-sqlite` (regtest).

- coloured dot: `#3399ff` (the node's `color`)
- alias: `orchard`
- "Mint backend" sub-label with `link` icon (because `lightning_info.backend === true`)
- state dot: green, "online"
- one chip: `03d001315c1...@172.26.0.4:9735`, globe icon next to chip has **red/inactive** dot (the regtest probe resolves the LN node's container IP to a private range; `connections[0].reachable === false` ⇒ status `'inactive'`)
- counts: `2` Peers, `2` Channels

### 2. Online — multiple URIs (tor + IPv4 + IPv6), no Mint backend

Node with mixed advertised addresses and not acting as a mint backend.

- each URI becomes a `mat-chip` prefixed with an `orc-network-connection-status` icon
- `.onion` addresses truncate to `{pubkey11}...@{first7}...onion:{port}` and render the Tor icon (svgIcon="tor")
- clearnet IPv4 / IPv6 addresses render the globe icon (`vpn_lock_2`)
- chips stack vertically because `.orc-column-chip-set` forces column layout
- when a chip's address has no matching entry in `connections_status_map`, the icon renders with `orc-outline-color` + a pulse animation (`!status()` in `network-connection-status.component.html:9`)
- "Mint backend" sub-label is absent when `lightning_info.backend === false`; alias row collapses to just the alias

### 3. Syncing (chain or graph not yet synced)

`lightning_info.synced_to_chain === false` OR `lightning_info.synced_to_graph === false`.

- state dot: amber, text: "syncing"
- all other fields render their current values (peers, channels, URIs continue to render)
- the *parent* also renders its sibling `orc-lightning-general-channel-summary` tile alongside this card; neither card is structurally altered by syncing, only the dot + label.

### 4. Offline (error)

`error === true` (parent's `errors_lightning.length > 0`).

- state dot: red, text: "offline"
- cached `lightning_info` / counts / URI chips continue to render (no blank-out). This is intentional per `AGENTS.md` — show the last-known data, surface the error via the dot, don't wipe the UI.

### 5. No URIs

`lightning_info.uris === []` (node not yet advertising any reachable address).

- The `@for` over `uris()` renders nothing — **there is no "No connections" fallback** (unlike `orc-bitcoin-general-info`, which prints italic "No connections" in the empty branch).
- The static "Connections" label still renders, sitting alone above the Peers row.

### 6. URI dialog (opened by clicking a chip)

Clicking a chip calls `onUriClick(uri)` ([lightning-general-info.component.ts:81](../../src/client/modules/lightning/modules/lightning-general/components/lightning-general-info/lightning-general-info.component.ts#L81)), which rasterises a coloured-circle PNG from `lightning_info.color` (or `#000000` fallback) and opens `NetworkConnectionComponent`. See the dedicated **Child components → `orc-network-connection` (URI dialog)** section below for a full enumeration of reachable dialog states, interactions, and the parent-supplied data contract.

## Child components

### `orc-network-connection` (URI dialog)

Opened by `onUriClick(uri)` when the user clicks a URI chip. Rendered inside a `MatDialog` overlay. Same child component as the Bitcoin info card uses — the **difference is what the parent passes in**.

- Source: [network-connection.component.ts](../../src/client/modules/network/components/network-connection/network-connection.component.ts) · [`.html`](../../src/client/modules/network/components/network-connection/network-connection.component.html)
- Data type: [`NetworkConnection`](../../src/client/modules/network/types/network-connection.type.ts) — injected via `MAT_DIALOG_DATA`.

#### Parent → child data contract

The parent builds the `data` payload in `onUriClick` ([lightning-general-info.component.ts:84-94](../../src/client/modules/lightning/modules/lightning-general/components/lightning-general-info/lightning-general-info.component.ts#L84)):

| Field | Source | Value for this parent |
|---|---|---|
| `uri` | `uri.uri` | Full `{pubkey}@{host}:{port}` — un-truncated, even when the chip label truncates pubkey to 11 chars |
| `type` | `uri.type` | `'clearnet'` or `'tor'` — never `'insecure'`; `transformUri()` only emits these two |
| `label` | `uri.label` | The truncated chip label (pubkey trimmed + optionally onion-shortened) — the child does not render it in this usage |
| `image` | `await this.createCirclePng(lightning_info?.color ?? '#000000')` | PNG data-URI of a solid coloured circle, rasterised at 128 px from the **LN node's own `color` field**. Contrast with the Bitcoin parent which always passes a black block glyph |
| `name` | `lightning_info?.alias` | e.g. `'orchard'` — drives the download filename (`{alias}_qr.png`) |
| `section` | literal | `'lightning'` — rendered in the dialog title via `titlecase` → "Lightning …" |
| `status` | `connections_status_map().get(address)` *(where `address = uri.uri.split('@')[1]`)* | `'active' \| 'inactive' \| 'warning' \| null`. **Important**: the lookup key is the address-only portion (`host:port`), not the full pubkey@address URI. This differs from the Bitcoin parent, whose URIs ARE just `host:port` and use the full `uri.uri` as the lookup key |
| `device_type` | `device_type()` | `'desktop' \| 'tablet' \| 'mobile'` — controls QR size inside the child |

#### Child inputs / outputs / signals

- No `@Input()`s — all data arrives via `MAT_DIALOG_DATA`.
- No `@Output()`s — dialog closure is handled by Material's `mat-dialog-close`.
- `qr_canvas` — `viewChild<ElementRef>` that receives the `QRCodeStyling` DOM node in `ngAfterViewInit`.
- `qr_options` — reactive `FormGroup` with two controls:
  - `style` — `'0' | '1' | '2' | '3'` (slider, required, initial `'0'`)
  - `image` — `boolean` (slide toggle, required, initial `true`)
- `size` computed → `295` if `data.device_type === 'mobile'`, else `395`. Read at QR init time.
- `status_message` computed → maps `data.status` to a human label: `'active'` → `"Publicly reachable"`, `'inactive'` → `"Not reachable"`, `'warning'` → `"API offline"`, anything else (including `null`) → `"Unknown status"`.

#### Reachable child states

The live regtest chip routes through this dialog with `status: 'inactive'` (the reachability probe blocks the private-range `172.26.0.5:9735`), so the **default state this parent produces is "Not reachable"**. The other status variants were captured via signal override on the same open dialog.

##### `active` — publicly reachable

- Title: `Lightning clearnet connection` / `Lightning tor connection`
- Subtitle: `Publicly reachable`
- Status icon tinted `orc-status-active-color` (green).
- **Verified live** via override after mutating `connections` to flip the probe result.

##### `inactive` — not reachable *(default live state on regtest)*

- Subtitle: `Not reachable`
- Status icon tinted `orc-status-inactive-color` (red).
- This is the state the user sees on a fresh regtest stack: the LN node advertises a private-range IP (`172.26.0.x`), the reachability probe rejects private ranges, and the map entry becomes `'inactive'`.

##### `warning` — API offline

- Subtitle: `API offline`
- Status icon tinted `orc-status-warning-color` (amber).
- Reached when the reachability-probe backend itself is unavailable (not an LN node problem).

##### `null` / unknown

- Subtitle: `Unknown status`
- Status icon falls to `orc-outline-color` (muted/grey) with a pulse animation (`!status()` branch in `network-connection-status.component.html:9`).
- Reached when `connections_status_map` has no entry for the chip's `host:port` — e.g. fresh load before the first probe completes, or a URI whose address does not match any probe result.

##### Type variant: `clearnet` vs `tor`

- `data.type === 'tor'` — status component renders `svgIcon="tor"` (Tor onion glyph). Title reads `Lightning tor connection`. Chip-side label is shortened to `{first7chars}...onion:{port}` by `transformUri()`.
- `data.type === 'clearnet'` — status component renders the `vpn_lock_2` Material icon (globe + padlock). Title reads `Lightning clearnet connection`. Chip-side label shows the full address.
- `data.type === 'insecure'` — supported by the status child (`icon === 'language'`, bare globe) but unreachable from this parent. `transformUri()` only emits `'tor'` or `'clearnet'`.

##### QR style slider (`qr_options.style`) and image toggle

Four discrete styles (`'0'`–`'3'`), same as documented on the Bitcoin info card. See [bitcoin-general-info.md](./bitcoin-general-info.md#qr-style-slider-qr_optionsstyle) for the mapping — identical behaviour here, only the embedded image differs:

- image `true` *(default)* — the centre 30% shows a solid coloured circle matching `lightning_info.color` (e.g. the LND default `#3399ff` blue on regtest), with `hideBackgroundDots: true` clearing QR modules behind it.
- image `false` — circle disappears; QR re-renders with no centre graphic.

##### Device size variants

- `device_type === 'mobile'` → 295×295 QR, URI row capped to `max-width: 295px`.
- `device_type === 'desktop'` or `'tablet'` → 395×395 QR.

Changing `data.device_type` after the dialog is open does NOT resize the QR (set once in `ngAfterViewInit`).

#### Child interactions

| Gesture | Target | Result |
|---|---|---|
| copy URI | `orc-button-copy` wrapping `.mega-string` | copies the full pubkey@address `data.uri` (not the truncated label) to clipboard |
| drag slider | `mat-slider[matSliderThumb]` bound to `qr_options.style` | fires `onStyleChange()` → `qr_code.update({dotsOptions, cornersSquareOptions})` |
| toggle image | `mat-slide-toggle` bound to `qr_options.image` | fires `onImageChange($event)` → `qr_code.update({image: event.checked ? data.image : undefined})` |
| click **Download** | `button[mat-stroked-button][mat-dialog-close]` | calls `qr_code.download({name: '{alias}_qr', extension: 'png'})` (e.g. `orchard_qr.png`) AND closes the dialog |
| click **Close** | `button[mat-button][mat-dialog-close]` | closes the dialog via MatDialog overlay |
| click backdrop / press `Esc` | Material overlay | default MatDialog dismissal |

#### How the dialog closes + what propagates back

The dialog returns no value to the parent. `onUriClick` does not `await` or subscribe to `afterClosed()`; the parent card is unaffected by dialog lifecycle. Reopening the same chip re-rasterises the circle PNG (every open is a fresh paint) and creates a new dialog instance.

#### Further-nested children

- `orc-network-connection-status` (title glyph) — pure presentational status icon. Three icon paths (`tor` svgIcon, `vpn_lock_2`, `language`); four status colour classes (`active`/`inactive`/`warning`/default-muted-with-pulse). Specced inline above.
- `orc-button-copy` (URI copy) — shared copy-button component with its own ripple + transient "copied" confirmation. Not enumerated here.

## Unhappy / edge cases

- **`lightning_info` null but component rendered** — alias, colour dot background, counts, and "Mint backend" all use optional chaining and render as empty/undefined. `syncing` evaluates to `true` (because `!undefined === true`), so the card defaults to the `syncing` state unless `error` is set. In practice the parent gates on `!loading()` so this is only a mid-flight window.
- **`lightning_info.uris` contains a pubkey-only string with no `@`** — `address` is `undefined`, `is_tor` is `false` (undefined.includes would throw, but the `?.includes` form prevents it — `address?.includes('.onion')` returns `undefined`, coerced to `false`), so the chip renders as clearnet with `{pubkey11}...@undefined`. bitcoind/lnd don't emit malformed URIs; defensive case only.
- **`.onion` address with additional port separators** — `address.split(':').pop()` always takes the last segment, so `abcdef.onion:1:9735` would render as `abcdef...onion:9735`. Not a real scenario for LND.
- **Non-standard onion hostnames with extra subdomains** — the `.onion` split is naive (`address.split('.onion')[0].slice(0, 7)`); a nested onion domain like `sub.xxx.yyy.onion` would truncate the first 7 chars of the *first* subdomain, not the onion id.
- **Duplicate URIs** — the `@for` tracks by `connection.uri`; duplicates would collapse to a single chip.
- **Very long IPv6 addresses** — rendered in full without truncation; `.orc-column-chip-set` wraps chips to new lines rather than overflowing.
- **Empty `uris` and empty `connections`** — no chips render; "Connections" label sits alone with no content above it. No fallback text.
- **Projected button missing** — the bottom flex row renders channels-only with empty space where the FAB would sit. Not a real scenario in current usage.
- **`lightning_info.color` missing/empty** — `[style.background-color]` receives `undefined`, the dot renders transparent. QR centre graphic falls back to `#000000` in `onUriClick()`.

## Template structure (at a glance)

```
.flex-column
├── "Info" title
└── mat-card
    └── mat-card-content
        ├── top row: [colour dot] alias / "Mint backend"?          ·  [status dot] {state}
        ├── URI block: mat-chip-set (column layout, one chip per URI, status-dot prefix)
        │              └── "Connections" label (always rendered, even when chip-set is empty)
        ├── peers: {num_peers} / "Peers"
        └── bottom row: {open_channels} / "Channels"  ·  <ng-content/>  (parent projects "Open Lightning" FAB)
```

## Interaction summary

| Gesture | Target | Result |
|---|---|---|
| click URI chip | `(click)` on `mat-chip` | calls `onUriClick()` → rasterises circle PNG → opens `NetworkConnectionComponent` dialog |
| click projected "Open Lightning" button | parent FAB with `[routerLink]="['/lightning']"` | navigates to `/lightning` |
| hover chip | `matRipple` on chip | ripple — no state change |
| copy URI *(inside `orc-network-connection`)* | `orc-button-copy` | copies the full pubkey@address to clipboard |
| drag QR style slider *(inside `orc-network-connection`)* | `mat-slider` | `onStyleChange()` swaps dot + corner-square types (`0`→`3`) |
| toggle QR image *(inside `orc-network-connection`)* | `mat-slide-toggle` | `onImageChange()` adds/removes the coloured centre circle |
| click Download *(inside `orc-network-connection`)* | stroked button | `qr_code.download({name: '{alias}_qr'})` + closes dialog |
| click Close *(inside `orc-network-connection`)* | text button | closes dialog (no return value) |

## Test fidelity hooks

The existing unit spec [`lightning-general-info.component.spec.ts`](../../src/client/modules/lightning/modules/lightning-general/components/lightning-general-info/lightning-general-info.component.spec.ts) asserts only that the component creates (constructor wiring) with `lightning_info` null + `error` false + `device_type` 'desktop'. There is **no e2e spec yet** for this card.

States worth adding to a new e2e spec:

- `online` structure: card renders, alias matches `getinfo.alias`, "Mint backend" sub-label matches `network_info.backend` truth
- peer count + channel count match `lightning-cli getinfo` / `lncli getinfo` output (differential assertion, as in `bitcoin-general-info.spec.ts`)
- URI chip rendering when `lightning_info.uris` is non-empty, including `clearnet` vs `tor` icon selection
- URI click → `NetworkConnectionComponent` dialog opens with the correct full URI and section="lightning"
- `offline` rendering when `errors_lightning[]` is populated (pause the LN container)
- `syncing` rendering (hard to trigger in regtest — would need a fixture that stalls graph sync)
- empty-URIs branch: assert the absence of "No connections" text (regression guard — a future refactor that copies the bitcoin card's fallback would break this)

Child-component states skipped by the current e2e spec (see `Child components → orc-network-connection`):

- Dialog opens with `data.section === 'lightning'` → title reads `Lightning {type} connection`
- Dialog opens with `data.status === 'inactive'` on regtest (the default) — visible red status glyph + `Not reachable` subtitle
- `active` / `warning` / `null` `status_message` variants — require synthetic or differently-configured reachability probes
- `data.type === 'tor'` svgIcon path — regtest never emits onion URIs, so the Tor title icon is only reachable via a non-regtest fixture
- `data.name` → download filename (`{alias}_qr.png`) — easier to cover in the child's own unit spec than e2e
- Centre-graphic colour contract: `createCirclePng(lightning_info.color)` renders a solid coloured circle matching the node's alias colour — regression guard if a future refactor swaps the image helper
- `status` lookup key is the address-only portion (`uri.split('@')[1]`), not the full URI — worth a direct unit test against `onUriClick`, because silently switching to full-URI lookup would always return `null`

## Notes for implementers

- This is `OnPush` with signal inputs — if a parent passes a new `LightningInfo` instance each poll, reference inequality triggers re-render. The parent [`index-subsection-dashboard`](../../src/client/modules/index/modules/index-subsection-dashboard/components/index-subsection-dashboard/index-subsection-dashboard.component.ts:330) reassigns `lightning_info` on every poll, so the card re-renders each cycle.
- `createCirclePng` runs at click time inside `onUriClick()`, not at render; opening the QR dialog is cheap until the user clicks. The unused `createCircleSvg()` helper is still on the class but never called — dead code candidate.
- No internal subscriptions ⇒ no `ngOnDestroy` cleanup required; the class body has no lifecycle hooks, which is appropriate.
- The `connections` input defaults to `[]` (unlike the other required inputs) — if the parent omits it, chip dots will show the default "unknown" pulse state rather than erroring.
- Contrast with `orc-bitcoin-general-info`: that component renders italic "No connections" when its URI block is empty; this component renders an empty chip-set above the "Connections" label instead. If the two cards are ever unified, this is the user-facing delta to reconcile.
