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

Rendered by [`NetworkConnectionComponent`](../../src/client/modules/network/components/network-connection/network-connection.component.ts), not by this component — but the click path originates in `onUriClick()` (`lightning-general-info.component.ts:81`).

- Title: `Lightning {type} connection` where `{type}` is `clearnet` or `tor`
- Status subtitle: `Publicly reachable` / `Not reachable` / `API offline` / `Unknown status` (from `status_message` computed, keyed off the `connections_status_map` lookup for the chip's `host:port`)
- URI row with `content_copy` button showing the full un-truncated pubkey@address
- QR code with a **coloured circle** in the centre — PNG rasterised at 128 px from `lightning_info.color` via the private `createCirclePng()` helper (distinct from the Bitcoin card, which embeds a block-icon PNG)
- Slider (QR module style) + toggle for showing the centre image
- `Download` + `Close` actions
- `name` field in the dialog data is the LN `alias`; `section` is `'lightning'`

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

## Notes for implementers

- This is `OnPush` with signal inputs — if a parent passes a new `LightningInfo` instance each poll, reference inequality triggers re-render. The parent [`index-subsection-dashboard`](../../src/client/modules/index/modules/index-subsection-dashboard/components/index-subsection-dashboard/index-subsection-dashboard.component.ts:330) reassigns `lightning_info` on every poll, so the card re-renders each cycle.
- `createCirclePng` runs at click time inside `onUriClick()`, not at render; opening the QR dialog is cheap until the user clicks. The unused `createCircleSvg()` helper is still on the class but never called — dead code candidate.
- No internal subscriptions ⇒ no `ngOnDestroy` cleanup required; the class body has no lifecycle hooks, which is appropriate.
- The `connections` input defaults to `[]` (unlike the other required inputs) — if the parent omits it, chip dots will show the default "unknown" pulse state rather than erroring.
- Contrast with `orc-bitcoin-general-info`: that component renders italic "No connections" when its URI block is empty; this component renders an empty chip-set above the "Connections" label instead. If the two cards are ever unified, this is the user-facing delta to reconcile.
