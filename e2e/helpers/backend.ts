/**
 * Source-of-truth readers for differential specs, via `docker exec` into the
 * regtest containers — no certs or macaroons leave the container. Reads are
 * memoized per worker process via `cached()`; regtest fixtures don't mutate
 * mid-run, so cache-once-per-process is safe.
 */

/* Native Dependencies */
import {btcCli, btcCliJson, dockerExec, lndCliJson, clnCliJson} from './docker-cli';
import {containerBitcoind, containerForNode, isLnd, lndDirForNode, type ConfigInfo, type LnNode} from './config';

const _cache = new Map<string, unknown>();

/** Memoize an idempotent backend read. Key is the only knob; pass enough
 *  identity (config name + args) to disambiguate. */
function cached<T>(key: string, getter: () => T): T {
	if (_cache.has(key)) return _cache.get(key) as T;
	const v = getter();
	_cache.set(key, v);
	return v;
}

export const btc = {
	blockCount(config: ConfigInfo): number {
		return cached(`btc.blockCount:${config.name}`, () => btcCliJson<number>(containerBitcoind(config), ['getblockcount']));
	},

	getBlockchainInfo(config: ConfigInfo): Record<string, unknown> {
		return cached(`btc.getBlockchainInfo:${config.name}`, () => btcCliJson(containerBitcoind(config), ['getblockchaininfo']));
	},

	getNetworkInfo(config: ConfigInfo): Record<string, unknown> {
		return cached(`btc.getNetworkInfo:${config.name}`, () => btcCliJson(containerBitcoind(config), ['getnetworkinfo']));
	},

	/** Verbose form — returns an object keyed by txid (Orchard flattens to an array). */
	getRawMempool(config: ConfigInfo): Record<string, unknown> {
		return cached(`btc.getRawMempool:${config.name}`, () => btcCliJson(containerBitcoind(config), ['getrawmempool', 'true']));
	},

	getBestBlockHash(config: ConfigInfo): string {
		// Raw output: bitcoin-cli returns the hash as a bare hex string, not JSON.
		return cached(`btc.getBestBlockHash:${config.name}`, () => btcCli(containerBitcoind(config), ['getbestblockhash']));
	},

	/** Verbosity 2 — matches what Orchard's resolver uses. */
	getBlock(config: ConfigInfo, hash: string): Record<string, unknown> {
		return cached(`btc.getBlock:${config.name}:${hash}`, () => btcCliJson(containerBitcoind(config), ['getblock', hash, '2']));
	},
};

/** LN reads — dispatches to lncli or lightning-cli based on config.ln. */
export const ln = {
	getInfo(config: ConfigInfo, node: LnNode = 'orchard'): Record<string, unknown> {
		return cached(`ln.getInfo:${config.name}:${node}`, () => {
			const container = containerForNode(config, node);
			return isLnd(config, node)
				? lndCliJson(container, ['getinfo'], lndDirForNode(config, node))
				: clnCliJson(container, ['getinfo']);
		});
	},

	/**
	 * Total on-chain wallet sats for the named node. Matches what Orchard's
	 * `lightning_wallet` resolver aggregates (sum of addresses' balances) —
	 * channel-committed funds live elsewhere.
	 */
	onchainSats(config: ConfigInfo, node: LnNode = 'orchard'): number {
		return cached(`ln.onchainSats:${config.name}:${node}`, () => {
			const container = containerForNode(config, node);
			if (isLnd(config, node)) {
				const bal = lndCliJson<{total_balance: string}>(container, ['walletbalance'], lndDirForNode(config, node));
				return parseInt(bal.total_balance, 10);
			}
			const funds = clnCliJson<{outputs: {amount_msat: number}[]}>(container, ['listfunds']);
			return funds.outputs.reduce((sum, o) => sum + Math.floor(Number(o.amount_msat) / 1000), 0);
		});
	},

	/** Count of the node's channels that do NOT carry taproot-asset metadata.
	 *  Mirrors the orc-lightning-general-channel-summary component's sat-row
	 *  filter (channels with empty `custom_channel_data`). LND only — CLN has
	 *  no asset-channel concept. */
	satChannelCount(config: ConfigInfo, node: LnNode = 'orchard', opts: {activeOnly?: boolean} = {}): number {
		return cached(`ln.satChannelCount:${config.name}:${node}:${!!opts.activeOnly}`, () =>
			countChannels(config, node, opts, (c) => !c.custom_channel_data || c.custom_channel_data === ''),
		);
	},

	/** Count of the node's channels that DO carry taproot-asset metadata
	 *  (non-empty `custom_channel_data`). Mirrors the tapass-row filter in
	 *  orc-lightning-general-channel-summary. LND-only (integrated tapd). */
	assetChannelCount(config: ConfigInfo, node: LnNode = 'orchard', opts: {activeOnly?: boolean} = {}): number {
		return cached(`ln.assetChannelCount:${config.name}:${node}:${!!opts.activeOnly}`, () =>
			countChannels(config, node, opts, (c) => !!c.custom_channel_data && c.custom_channel_data !== ''),
		);
	},

	/** Sat-row channel count as the dashboard's channel-summary card sees it.
	 *  Dispatches lnd → `satChannelCount` (filters by `custom_channel_data`);
	 *  cln → getinfo's `num_active_channels (+ num_inactive_channels)` because
	 *  cln has no asset-channel concept. */
	openSatChannelCount(config: ConfigInfo, opts: {activeOnly?: boolean} = {}): number {
		if (config.ln === 'lnd') return ln.satChannelCount(config, 'orchard', opts);
		const info = ln.getInfo(config) as {num_active_channels?: number; num_inactive_channels?: number};
		const active = info.num_active_channels ?? 0;
		if (opts.activeOnly) return active;
		return active + (info.num_inactive_channels ?? 0);
	},
};

/** NUT-06 `/v1/info` shape, narrowed to the fields the dashboard's mint
 *  card renders. The full Cashu spec includes `pubkey`, `nuts`, etc. —
 *  add fields here as specs need them. `urls` is optional in NUT-06 and
 *  null/missing on fixtures that don't advertise public URLs. */
export type MintNutInfo = {
	name?: string | null;
	description?: string | null;
	description_long?: string | null;
	icon_url?: string | null;
	urls?: string[] | null;
	version?: string;
};

export const mint = {
	/** Read mint state straight from the daemon. Both nutshell and cdk
	 *  expose NUT-06 at `/v1/info` over their in-container loopback port,
	 *  reachable via docker exec. */
	getInfo(config: ConfigInfo): MintNutInfo {
		return cached(`mint.getInfo:${config.name}`, () => {
			// 127.0.0.1 not localhost — cdk-mintd's container has no `localhost`
			// entry in /etc/hosts. nutshell ships curl, cdk-mintd ships wget;
			// `sh -c` chains so the call survives whichever tool is in $PATH.
			const url = `http://127.0.0.1:${config.mintPort}/v1/info`;
			const cmd = `curl -fsS ${url} 2>/dev/null || wget -qO- ${url}`;
			const out = dockerExec(['exec', config.containers.mint, 'sh', '-c', cmd]);
			return JSON.parse(out) as MintNutInfo;
		});
	},
};

/** Single asset record from `tapcli assets list`, narrowed to the fields
 *  specs read. tapd's response carries many more — extend as needed. */
export type TapdAsset = {
	asset_genesis: {name: string; asset_id: string; asset_type: string};
	asset_group?: {tweaked_group_key?: string};
	amount: string;
	decimal_display?: {decimal_display?: number};
	version: string;
};

export const tap = {
	/** All assets the orchard tapd holds. tapd runs integrated inside the litd
	 *  container (no separate gRPC port) — tapcli reaches it via litd's :8443
	 *  with the litd TLS cert + tapd admin macaroon. Throws on stacks where
	 *  `config.tapd === false`. */
	listAssets(config: ConfigInfo): TapdAsset[] {
		if (!config.tapd) throw new Error(`stack ${config.name} has no tapd`);
		if (config.ln === false) throw new Error(`unreachable: no-LN stack ${config.name} has tapd=true`);
		return cached(`tap.listAssets:${config.name}`, () => {
			const out = dockerExec([
				'exec', config.containers.lnOrchard, 'tapcli',
				'--rpcserver=localhost:8443',
				'--tlscertpath=/home/litd/.lit/tls.cert',
				'--macaroonpath=/home/litd/.tapd/data/regtest/admin.macaroon',
				'--network=regtest',
				'assets', 'list',
			]);
			return (JSON.parse(out) as {assets: TapdAsset[]}).assets;
		});
	},

	/** Find an asset by genesis name. Throws if the fixture didn't seed it. */
	getAsset(config: ConfigInfo, name: string): TapdAsset {
		const found = tap.listAssets(config).find((a) => a.asset_genesis.name === name);
		if (!found) {
			throw new Error(`asset '${name}' not found on ${config.name} (check fund-tapd.sh)`);
		}
		return found;
	},
};

function countChannels(
	config: ConfigInfo,
	node: LnNode,
	opts: {activeOnly?: boolean},
	predicate: (channel: {custom_channel_data?: string}) => boolean,
): number {
	if (!isLnd(config, node)) {
		throw new Error(`channel counting only implemented for LND nodes (got ${config.ln})`);
	}
	const container = containerForNode(config, node);
	const args = ['listchannels'];
	if (opts.activeOnly) args.push('--active_only');
	const listed = lndCliJson<{channels: Array<{custom_channel_data?: string}>}>(container, args, lndDirForNode(config, node));
	return listed.channels.filter(predicate).length;
}
