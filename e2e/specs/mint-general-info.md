# `orc-mint-general-info`

Source: [mint-general-info.component.ts](../../src/client/modules/mint/modules/mint-general/components/mint-general-info/mint-general-info.component.ts) · [`.html`](../../src/client/modules/mint/modules/mint-general/components/mint-general-info/mint-general-info.component.html)

## Purpose

The **Info** card on the dashboard (`/`) and the mint subsection dashboard (`/mint`) summarising the identity of the local Cashu mint backing Orchard. It is a pure presentational container — no service calls, no subscriptions of its own. Its job is to render:

- the mint icon (or a placeholder `+` add-button when unset, a shimmer when loading, a red error glyph when the icon resource failed)
- the mint name (or italicised *Untitled Mint* when null) and a traffic-light state (`online` / `offline`)
- the mint's advertised reachable URLs as clickable chips with per-chip status dots (opens a QR/copy dialog)
- the mint description (or italic *No description* fallback)
- a projected slot (`ng-content`) for an "Open Mint" action button

Both the icon and the name are navigation buttons — clicking either routes to `/mint/info` with a `state.focus_control` hint (`'icon_url'` for the icon, `'name'` for the name).

## Where it renders

- **Dashboard tile** — [`orc-index-subsection-dashboard-mint-enabled`](../../src/client/modules/index/modules/index-subsection-dashboard/components/index-subsection-dashboard-mint-enabled/index-subsection-dashboard-mint-enabled.component.html:6) on `/`. Mounted only when `enabled_mint` is true in runtime config AND the parent's `loading()` is false (the card is wrapped in `@if (!loading())`). The parent passes `error = mint_errors().length > 0`, projects the **Open Mint** extended FAB into `<ng-content>`, and binds a `matMenuTriggerFor` (desktop) or a bottom-sheet open handler (mobile) to that FAB.
- **Mint dashboard summary tile** — [`orc-mint-subsection-dashboard`](../../src/client/modules/mint/modules/mint-subsection-dashboard/components/mint-subsection-dashboard/mint-subsection-dashboard.component.html:9) on `/mint`. Always passes `[error]="false"` (the mint dashboard handles errors elsewhere) and projects nothing into the `<ng-content>` slot.

## Inputs

| Input | Type | Required | Notes |
|---|---|---|---|
| `loading` | `boolean` | ✓ | Drives the `mint-general-icon` + `mint-general-name` shimmer states. The parent dashboard tile passes `loading_icon` (icon-image fetch only); `mint-subsection-dashboard` passes `loading_mint_icon` (the mint icon image data fetch). |
| `icon_data` | `string \| null` | ✓ | Data-URL string for the mint icon, fetched by `PublicService.getPublicImageData(info.icon_url)`. `null` when `info.icon_url` is unset or the fetch hasn't returned. |
| `info` | `MintInfo \| null` | ✓ | From the `mintInfo` query, wrapped in [`MintInfo`](../../src/client/modules/mint/classes/mint-info.class.ts). Null before first response or when the mint hasn't been initialised. |
| `error` | `boolean` | ✓ | True when the parent has any mint errors. The dashboard tile passes `mint_errors().length > 0`; the `/mint` summary always passes `false`. |
| `device_type` | `'desktop' \| 'tablet' \| 'mobile'` | ✓ | Forwarded into the URI dialog (`MAT_DIALOG_DATA.device_type`); does not affect this component's own layout. |
| `connections` | `PublicUrl[]` | optional (default `[]`) | Result of probing each `info.urls[i] + critical_path` with `PublicService.getPublicUrlsData`. Each probe yields `{url, status, has_data, ip_address}` and the `PublicUrl.connection_status` getter maps that to `'active' \| 'inactive' \| 'warning'`. |

## Outputs & projected content

- No `@Output()`s.
- One `<ng-content>` slot in the bottom flex row, to the right of the Description block. Parents project the **Open Mint** extended FAB; the FAB's menu/bottom-sheet wiring lives on the parent. The mint subsection dashboard projects nothing (the slot collapses).

## Derived / computed signals

- `state` → `'offline' | 'online'`
  - `error` ⇒ `offline`
  - else ⇒ `online`
  - There is **no `syncing` branch** (unlike `orc-bitcoin-general-info`); a Cashu mint is treated as binary online/offline at this card.
- `status` → `'inactive' | 'active'` — parallel to `state`, drives the `orc-graphic-status` dot colour.
- `uris` → array of `MintUri = {uri, origin, type, label}` derived from `info.urls[]`. Each url is parsed with `new URL(url)`:
  - if the parse fails (malformed URL), it falls through to a string-based fallback that still emits `uri/origin/label` from the raw input.
  - `type` is `'tor'` if the url contains `.onion`, `'insecure'` if it starts with `http://`, otherwise `'clearnet'`.
  - `label` is the hostname (with port appended if present); for `.onion` hosts it is truncated to the first 15 chars + `...onion`.
  - `origin` is the parsed `URL.origin` (e.g. `https://mint.example.com:3338`) — this is the lookup key into `connections_status_map`.
- `connections_status_map` → `Map<origin, connection_status>` built from `connections` by keying each entry on `new URL(result.url).origin`. Used both by each chip's status dot and by the dialog's `status` payload.

## Happy path

1. Parent gates this in `@if (!loading())`, so on first render `info` is populated and `icon_data` has either resolved or settled to `null`.
2. Top row: icon (image / shimmer / placeholder / error glyph based on `mint-general-icon.state`) on the left; name as a clickable text button on the right (or *Untitled Mint* italic when `info.name` is null); state dot + state label on the far right.
3. URI block: one `mat-chip` per `uris()` entry, each prefixed with an `orc-network-connection-status` icon coloured by the `connections_status_map().get(connection.origin)` lookup. If `uris().length === 0`, the block falls to an italic *No connections* line. Below it: the static label "Connections".
4. Description row: `info.description` text in `font-size-l`, or *No description* italic fallback when null. To the right: the projected `<ng-content>` (Open Mint FAB) on the dashboard tile, empty on the `/mint` summary tile.
5. Click the mint icon ⇒ navigate to `/mint/info` with `state.focus_control = 'icon_url'`. Click the mint name ⇒ same route with `state.focus_control = 'name'`.
6. Click a URI chip ⇒ opens `NetworkConnectionComponent` dialog with a payload built in `onUriClick` (see Child components).

## Reachable states

### 1. Online — no URIs, no icon, has description (current live state on `lnd-nutshell-sqlite`)

The fixture mint (`e2e-nutshell`) advertises no `info.urls` and no `info.icon_url`.

- icon slot shows the placeholder `+` add-button (the `'unset'` state of `mint-general-icon`)
- name renders as the clickable text button "e2e-nutshell"
- state dot: green, label: "online"
- URI block falls to italic *No connections*, with the "Connections" label below
- description "Orchard e2e lnd-nutshell-sqlite" in `font-size-l`, with "Description" label below
- the projected "Open Mint" FAB sits to the right of the description (dashboard tile only)

### 2. Online — URIs populated (clearnet + insecure http + Tor mix)

Synthesised by overriding `cmp.uris` with three entries (`https://`, `http://`, `.onion`) and seeding `connections_status_map` with one of each status (`active`, `inactive`, `warning`).

- each URI becomes a `mat-chip` prefixed with an `orc-network-connection-status` dot
  - `clearnet` (`https://...`) → globe + padlock glyph (`vpn_lock_2`), green dot tint when active
  - `insecure` (`http://...`) → bare globe glyph (`language`), red tint when inactive
  - `tor` (`.onion`) → Tor svg icon, amber tint when warning
- `.onion` labels truncate to `<first-15-chars>...onion:<port>` (e.g. `abcdef012345678...onion:3338`)
- non-onion labels render the parsed hostname plus the port (e.g. `mint.example.com:3338`, `192.168.1.10:3338`)
- chips are clickable → QR dialog (see state 6)
- chip set wraps to multiple lines via `orc-column-chip-set`

### 3. Offline (error)

`error === true` (parent's `mint_errors.length > 0`). On the `/mint` summary tile this branch is unreachable because the parent hard-codes `[error]="false"`.

- state dot: red, label: "offline"
- cached `info` (name, urls, description) and `icon_data` continue to render (no blank-out). This is intentional per `AGENTS.md` — surface the error via the dot, don't wipe the UI.

### 4. Untitled Mint + No description

Fired when `info.name` is `null` and `info.description` is `null`. Either field can hit its fallback independently.

- name slot renders italic *Untitled Mint* (the `'unset'` branch of `mint-general-name`) instead of the clickable button. Note the `mint-general-name` `'unset'` branch does not navigate on click.
- description slot renders italic *No description*

### 5. Loading

`loading === true`.

- icon slot shows a shimmering grey pill (`.mint-icon-loading.orc-animation-shimmer-high`)
- name slot shows a shimmering grey bar (`.mint-name-loading.orc-animation-shimmer-high`)
- state dot + label, URI block, and description block continue to render whatever values the rest of the inputs hold (the shimmer is local to the icon + name children only)

### 6. Icon error

`mint-general-icon` switches to its `'error'` branch when its own `error` input is true. **The parent (`orc-mint-general-info`) does not currently bind `[error]` on `mint-general-icon`**, so this branch is unreachable through normal data flow today. It can be forced by overriding `iconCmp.state` directly. When forced:

- icon slot shows a red filled circle with an outlined `error` mat-icon
- everything else renders normally

### 7. URI dialog (opened by clicking a chip)

Clicking a chip calls `onUriClick(uri)` ([mint-general-info.component.ts:77](../../src/client/modules/mint/modules/mint-general/components/mint-general-info/mint-general-info.component.ts#L77)) which opens `NetworkConnectionComponent` with a `NetworkConnection` payload. See **Child components → `orc-network-connection`** below for the full enumeration of dialog states.

## Child components

### `orc-mint-general-icon` (icon slot)

- Source: [mint-general-icon.component.ts](../../src/client/modules/mint/modules/mint-general/components/mint-general-icon/mint-general-icon.component.ts) · [`.html`](../../src/client/modules/mint/modules/mint-general/components/mint-general-icon/mint-general-icon.component.html)
- Inputs: `loading: boolean` (required), `icon_data: string | null` (required), `error: boolean` (default `false` — not bound by the parent), `height: string` (default `2rem`; the parent overrides to `2.5rem`).
- `state` computed → `'loading' | 'error' | 'icon' | 'unset'` precedence: loading wins, then error, then `icon_data` truthy ⇒ icon, else unset.
- Reachable states (matches the four `@switch` branches in the template):
  - **`loading`** — shimmering grey pill (`mint-icon-loading.orc-animation-shimmer-high`).
  - **`icon`** — `<img [src]="icon_data()" alt="Mint Icon">` with `[style.height]="height()"` (here `2.5rem`); clickable.
  - **`unset`** — circle with `+` mat-icon, ripple, clickable.
  - **`error`** — red filled circle with outlined `error` mat-icon. Unreachable from this parent (see state 6 above).
- Interactions: clicking the `icon` or `unset` state calls `onClick()` → `router.navigate(['mint', 'info'], {state: {focus_control: 'icon_url'}})`. Loading and error states have no click handler.

### `orc-mint-general-name` (name slot)

- Source: [mint-general-name.component.ts](../../src/client/modules/mint/modules/mint-general/components/mint-general-name/mint-general-name.component.ts) · [`.html`](../../src/client/modules/mint/modules/mint-general/components/mint-general-name/mint-general-name.component.html)
- Inputs: `name: string | null`, `loading: boolean`, `error: boolean`, `size: 'medium' | 'large'` (parent passes `'large'`).
- `state` computed → `'loading' | 'error' | 'name' | 'unset'` with the same precedence as the icon child.
- Reachable states:
  - **`loading`** — shimmering grey bar.
  - **`name`** — clickable text button styled `title-l` at `size === 'large'`.
  - **`unset`** — italic *Untitled Mint* in `font-size-l` at `size === 'large'`. No click handler.
  - **`error`** — text "Mint Info Error" in `font-size-l` at `size === 'large'`. **Unreachable from this parent** because `[error]` is never bound on the `mint-general-name` element in `mint-general-info.component.html:9`. Worth knowing if the parent ever wires it through.
- Interactions: clicking the `name` branch calls `onClick()` → `router.navigate(['mint', 'info'], {state: {focus_control: 'name'}})`.

### `orc-network-connection-status` (URI status dot, also rendered inside the dialog title)

- Source: [network-connection-status.component.ts](../../src/client/modules/network/components/network-connection-status/network-connection-status.component.ts)
- Inputs: `type: string` (required), `status: string | null` (default `null`), `size: string` (default `'md'`; the dialog uses `'lg'`).
- `icon` computed → `'language'` for `type === 'insecure'`, else `'vpn_lock_2'`. The template separately switches the renderer to `<mat-icon svgIcon="tor">` when `type === 'tor'`.
- `status_class` computed → maps `active → orc-status-active-color` (green), `inactive → orc-status-inactive-color` (red), `warning → orc-status-warning-color` (amber), anything else → `orc-outline-color` (muted).
- Pure presentational; no interactions.

### `orc-network-connection` (URI dialog)

Opened by `onUriClick(uri)`. Rendered inside a `MatDialog` overlay.

- Source: [network-connection.component.ts](../../src/client/modules/network/components/network-connection/network-connection.component.ts) · [`.html`](../../src/client/modules/network/components/network-connection/network-connection.component.html)
- Data type: [`NetworkConnection`](../../src/client/modules/network/types/network-connection.type.ts) — injected via `MAT_DIALOG_DATA`.

#### Parent → child data contract

The parent builds the payload in `onUriClick` ([mint-general-info.component.ts:77-90](../../src/client/modules/mint/modules/mint-general/components/mint-general-info/mint-general-info.component.ts#L77)):

| Field | Source | Value for this parent |
|---|---|---|
| `uri` | `uri.uri` | The full URL string from `info.urls[i]` (e.g. `https://mint.example.com:3338`). Encoded into the QR. |
| `type` | `uri.type` | `'clearnet'`, `'insecure'`, or `'tor'`. All three branches of the child's icon/title `computed`s are reachable from this parent (compare to `orc-bitcoin-general-info` which never emits `'insecure'`). |
| `label` | `uri.label` | The display label (parsed hostname + port, possibly truncated `.onion`). Not rendered inside the dialog but still passed. |
| `image` | `icon_data() ?? '/mint-icon-placeholder.png'` | Embedded as the centre 30%-sized graphic in the QR. Falls back to the static placeholder PNG when the mint has no icon. **Important difference from the Bitcoin parent**, which rasterises a themed block-icon SVG at click time. |
| `name` | `info.name ?? ''` | Used only as the QR download filename prefix (`<name>_qr.png`). Empty string when the mint name is null — yields `_qr.png`. |
| `section` | literal `'mint'` | Rendered in the dialog title via `titlecase` → "Mint …". |
| `status` | `connections_status_map().get(uri.origin) ?? null` | `'active' \| 'inactive' \| 'warning' \| null`. **Lookup key is the parsed `URL.origin`**, not `host:port` — a meaningful contract difference from the Bitcoin parent. |
| `device_type` | `device_type()` | Picks the QR canvas size (see device variants below). |

#### Child inputs / outputs / signals

- No `@Input()`s — all data arrives via `MAT_DIALOG_DATA`.
- No `@Output()`s — closure goes through `mat-dialog-close` directives.
- `qr_canvas` — `viewChild<ElementRef>` that receives the `QRCodeStyling` DOM node in `ngAfterViewInit`.
- `qr_options` — reactive `FormGroup`:
  - `style: '0' | '1' | '2' | '3'` (slider, required, initial `'0'`)
  - `image: boolean` (slide toggle, required, initial `true`)
- `size` computed → `295` if `data.device_type === 'mobile'`, else `395`. Read once at QR init time.
- `status_message` computed → maps `data.status`: `'active'` → `Publicly reachable`, `'inactive'` → `Not reachable`, `'warning'` → `API offline`, else (incl. `null`) → `Unknown status`.

#### Reachable child states

##### `active` — Publicly reachable

- Title: `Mint clearnet connection` (or `Mint insecure connection` / `Mint tor connection` per type).
- Subtitle: `Publicly reachable`.
- Title status dot tinted green (`orc-status-active-color`).

##### `inactive` — Not reachable

- Subtitle: `Not reachable`. Status dot red.

##### `warning` — API offline

- Subtitle: `API offline`. Status dot amber.

##### `null` / unknown

- Subtitle: `Unknown status`. Status dot muted (`orc-outline-color`). This is the path taken before the probe responds, or when the connection map has no entry for that origin.

##### Type variant: `clearnet` / `insecure` / `tor`

- `clearnet` — globe + padlock (`vpn_lock_2`); title: `Mint clearnet connection`.
- `insecure` — bare globe (`language`); title: `Mint insecure connection`. Reachable here because `transformUrl` emits `'insecure'` for any `http://` URL.
- `tor` — Tor svg icon (`<mat-icon svgIcon="tor">`); title: `Mint tor connection`.

##### QR style slider (`qr_options.style`)

| Value | Dots | Corner squares |
|---|---|---|
| `'0'` *(default)* | `extra-rounded` | `extra-rounded` |
| `'1'` | `rounded` | `extra-rounded` |
| `'2'` | `classy` | `square` |
| `'3'` | `square` | `square` |

Moving the slider fires `onStyleChange()` → `qr_code.update({...})`; the QR re-rasterises in place.

##### QR image toggle (`qr_options.image`)

- `true` *(default)* — centre 30% PNG embeds the mint icon (or the placeholder PNG when `icon_data` is null), with `hideBackgroundDots: true`.
- `false` — `onImageChange({checked: false})` → `qr_code.update({image: undefined})`; the centre graphic disappears.

##### Device size variants

- `device_type === 'mobile'` → 295×295 QR canvas; URI row capped to `max-width: 295px`.
- `device_type === 'desktop'` or `'tablet'` → 395×395.
- `size` is computed once at init; changing `data.device_type` after open does NOT resize.

#### Child interactions

| Gesture | Target | Result |
|---|---|---|
| copy URI | `orc-button-copy` wrapping `.mega-string` | copies `data.uri` to clipboard |
| drag slider | `mat-slider[matSliderThumb]` | `onStyleChange()` → `qr_code.update({dotsOptions, cornersSquareOptions})` |
| toggle image | `mat-slide-toggle` | `onImageChange()` → `qr_code.update({image: event.checked ? data.image : undefined})` |
| click **Download** | `button[mat-stroked-button][mat-dialog-close]` | calls `qr_code.download({name: '{data.name}_qr', extension: 'png'})` AND closes the dialog (the same click triggers `mat-dialog-close`) |
| click **Close** | `button[mat-button][mat-dialog-close]` | closes the dialog via overlay |
| backdrop / `Esc` | Material overlay | default MatDialog dismissal |

#### How the dialog closes + what propagates back

The dialog returns no value to the parent. The parent does not subscribe to `afterClosed()`; reopening the same chip produces a fresh dialog instance.

## Unhappy / edge cases

- **`info` null but component rendered** — `info()?.name` falls to the `mint-general-name` `'unset'` branch (italic *Untitled Mint*); `info()?.description` falls to the *No description* italic; `uris()` returns `[]` (empty `urls ?? []`) → *No connections* italic. In practice the parent gates on `!loading()`, so a fully-null `info` is mid-flight only.
- **`info.urls` malformed (not a parseable URL)** — `transformUrl`'s `try` falls through to the catch path: `origin` is set to the raw input, `label` is the raw input (or its `.onion` short form). Status-map lookup will then miss because the map keys are the `new URL(...).origin` of the *probe* URLs, which were `${url}${critical_path}` — so a raw broken URL chip will show no status colour.
- **`info.urls` contains a non-`.onion` string with `.onion` substring** — the `is_tor` check is `url.includes('.onion')`, which is naive. `https://example.com/.onion-news/` would be misclassified as Tor and have its label truncated to `<first-15-chars>...onion:<port>`. Worth noting if the upstream mint advertises pathological URLs.
- **`info.name` is the empty string `''`** — `info() ? info()?.name : null` evaluates to `''`, the name child's `state` computed treats `''` as falsy ⇒ `'unset'` branch ⇒ italic *Untitled Mint*. Equivalent to null.
- **`info.urls[i]` ends with a slash** — `connections_status_map` keys on `URL.origin` (no trailing slash, no path), so the dot still resolves correctly even though `mint_connections` was probed against `${url.replace(/\/$/, '')}${critical_path}`.
- **Duplicate URLs** — `@for` tracks by `connection.uri`; duplicates collapse to a single chip. The mint normally dedupes upstream.
- **`icon_data` is a broken data-URL** — the `mint-general-icon` template still hits its `'icon'` branch (computed off `icon_data` truthiness) and renders a broken `<img>` placeholder. There is no `onerror` fallback to the `'error'` branch.

## Template structure (at a glance)

```
.flex-column
├── "Info" title
└── mat-card
    └── mat-card-content
        ├── top row: <orc-mint-general-icon> + <orc-mint-general-name>  ·  [status dot] {state}
        ├── URI block: mat-chip-set OR italic "No connections"  ·  "Connections" label
        └── bottom row:
            ├── description text (or italic "No description")  ·  "Description" label
            └── <ng-content/>  (parent projects "Open Mint" FAB)
```

## Interaction summary

| Gesture | Target | Result |
|---|---|---|
| click mint icon (`'icon'` or `'unset'` branch) | `orc-mint-general-icon` | `router.navigate(['mint', 'info'], {state: {focus_control: 'icon_url'}})` |
| click mint name (`'name'` branch only) | `orc-mint-general-name` | `router.navigate(['mint', 'info'], {state: {focus_control: 'name'}})` |
| click URI chip | `mat-chip` | `onUriClick()` → opens `NetworkConnectionComponent` dialog |
| hover chip | `matRipple` | ripple — no state change |
| click projected "Open Mint" button | parent FAB with `matMenuTriggerFor` | opens nav menu (desktop) or bottom sheet (mobile) — handled by parent |
| copy URI *(inside `orc-network-connection`)* | `orc-button-copy` | copies `data.uri` to clipboard |
| drag QR style slider *(inside `orc-network-connection`)* | `mat-slider` | swaps dot + corner-square types (`0`→`3`) |
| toggle QR image *(inside `orc-network-connection`)* | `mat-slide-toggle` | adds/removes the centre icon |
| click Download *(inside `orc-network-connection`)* | stroked button | `qr_code.download({name: '<info.name>_qr'})` + closes dialog |
| click Close *(inside `orc-network-connection`)* | text button | closes dialog (no return value) |

## Test fidelity hooks

The unit spec [`mint-general-info.component.spec.ts`](../../src/client/modules/mint/modules/mint-general/components/mint-general-info/mint-general-info.component.spec.ts) currently only asserts that the component instantiates with all required inputs set to null/false. There is no e2e spec yet (`mint-general-info.spec.ts` does not exist).

States that an e2e spec should cover:

- happy-path render of name + description on the dashboard tile (live state — fixture `e2e-nutshell` is sufficient)
- icon `'unset'` placeholder → click → router lands on `/mint/info`
- name → click → router lands on `/mint/info`
- *No connections* fallback (live; fixture has no `info.urls`)
- *No description* fallback (requires a fixture mint with `description: null`, or a synthetic input)
- offline (`error: true`) — only reachable via the dashboard tile, not the `/mint` summary tile (which hard-codes `false`)
- URI chip rendering — needs a fixture that advertises `info.urls` (not currently the case for `e2e-nutshell`)
- URI click → dialog opens with correct `uri` / `type` / `image` / `status` wiring

Child-component states an e2e spec would skip without explicit fixtures:

- `mint-general-icon` `'error'` branch — unreachable through normal binding; only forceable via component override.
- `mint-general-name` `'error'` branch — unreachable from this parent (the parent never binds `[error]`).
- `orc-network-connection` per-status subtitles (`Publicly reachable` / `Not reachable` / `API offline` / `Unknown status`) — require seeded `mint_connections` results.
- `orc-network-connection` `type === 'insecure'` and `'tor'` icons — require fixtures with `http://` or `.onion` URLs respectively.
- `orc-network-connection` QR style slider + image toggle round-trip — QR rasterisation is timing-sensitive; better unit-tested.
- `orc-network-connection` mobile size (295) — requires a mobile-viewport spec.

## Notes for implementers

- This component is `OnPush` with signal inputs. `connections_status_map` and `uris` are pure `computed`s with no internal caching beyond Angular's signal memoisation, so passing fresh array references each tick will rebuild them. The parent dashboards already feed stable references from `route.snapshot.data` and signal-backed fields.
- The `info.urls` lookup-by-origin convention diverges from `orc-bitcoin-general-info`, which keys on `host:port`. If a future refactor unifies the contract, both `connections_status_map` and the dialog `data.status` lookup must change together.
- The `mint-general-icon` `error` branch is currently dead code from this parent's perspective. Either wire `[error]="error()"` through, or remove the branch from the icon child if it's also unused elsewhere.
- The `mint-general-name` `error` branch is similarly dead code from this parent. The dashboard tile `index-subsection-dashboard-mint-enabled` already passes `error` into `mint-general-info`; passing it into `mint-general-name` would surface "Mint Info Error" in place of the name when the mint is unreachable. Worth considering for parity with the `online`/`offline` dot.
- No internal subscriptions ⇒ no `ngOnDestroy` cleanup is needed; the class body intentionally has no lifecycle hooks.
- `onUriClick` builds a fresh PNG-image string on each call only via the parent's already-cached `icon_data()` signal — no re-fetch, no rasterisation. Cheap; safe to spam.
