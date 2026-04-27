/**
 * Source-of-truth readers for differential specs. Reached via `docker exec`
 * into the regtest containers — no certs or macaroons leave the container.
 */

/* Native Dependencies */
import {btcCli, btcCliJson, dockerExec, lndCliJson, clnCliJson} from './docker-cli';
import {containerBitcoind, containerForNode, isLnd, lndDirForNode, type ConfigInfo, type LnNode} from './config';

export const btc = {
	blockCount(config: ConfigInfo): number {
		return btcCliJson<number>(containerBitcoind(config), ['getblockcount']);
	},

	getBlockchainInfo(config: ConfigInfo): Record<string, unknown> {
		return btcCliJson(containerBitcoind(config), ['getblockchaininfo']);
	},

	getNetworkInfo(config: ConfigInfo): Record<string, unknown> {
		return btcCliJson(containerBitcoind(config), ['getnetworkinfo']);
	},

	/** Verbose form — returns an object keyed by txid (Orchard flattens to an array). */
	getRawMempool(config: ConfigInfo): Record<string, unknown> {
		return btcCliJson(containerBitcoind(config), ['getrawmempool', 'true']);
	},

	getBestBlockHash(config: ConfigInfo): string {
		// Raw output: bitcoin-cli returns the hash as a bare hex string, not JSON.
		return btcCli(containerBitcoind(config), ['getbestblockhash']);
	},

	/** Verbosity 2 — matches what Orchard's resolver uses. */
	getBlock(config: ConfigInfo, hash: string): Record<string, unknown> {
		return btcCliJson(containerBitcoind(config), ['getblock', hash, '2']);
	},
};

/** LN reads — dispatches to lncli or lightning-cli based on config.ln. */
export const ln = {
	getInfo(config: ConfigInfo, node: LnNode = 'orchard'): Record<string, unknown> {
		const container = containerForNode(config, node);
		return isLnd(config, node)
			? lndCliJson(container, ['getinfo'], lndDirForNode(config, node))
			: clnCliJson(container, ['getinfo']);
	},

	/**
	 * Total on-chain wallet sats for the named node. Matches what Orchard's
	 * `lightning_wallet` resolver aggregates (sum of addresses' balances) —
	 * channel-committed funds live elsewhere.
	 */
	onchainSats(config: ConfigInfo, node: LnNode = 'orchard'): number {
		const container = containerForNode(config, node);
		if (isLnd(config, node)) {
			const bal = lndCliJson<{total_balance: string}>(container, ['walletbalance'], lndDirForNode(config, node));
			return parseInt(bal.total_balance, 10);
		}
		const funds = clnCliJson<{outputs: {amount_msat: number}[]}>(container, ['listfunds']);
		return funds.outputs.reduce((sum, o) => sum + Math.floor(Number(o.amount_msat) / 1000), 0);
	},

	/** Count of the node's channels that do NOT carry taproot-asset metadata.
	 *  Mirrors the orc-lightning-general-channel-summary component's sat-row
	 *  filter (channels with empty `custom_channel_data`). LND only — CLN has
	 *  no asset-channel concept. */
	satChannelCount(config: ConfigInfo, node: LnNode = 'orchard', opts: {activeOnly?: boolean} = {}): number {
		return countChannels(config, node, opts, (c) => !c.custom_channel_data || c.custom_channel_data === '');
	},

	/** Count of the node's channels that DO carry taproot-asset metadata
	 *  (non-empty `custom_channel_data`). Mirrors the tapass-row filter in
	 *  orc-lightning-general-channel-summary. LND-only (integrated tapd). */
	assetChannelCount(config: ConfigInfo, node: LnNode = 'orchard', opts: {activeOnly?: boolean} = {}): number {
		return countChannels(config, node, opts, (c) => !!c.custom_channel_data && c.custom_channel_data !== '');
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

/** Read mint state straight from the daemon. Both nutshell and cdk
 *  expose NUT-06 at `/v1/info` over their in-container loopback port,
 *  reachable via docker exec. Memoized per-config — `/v1/info` is
 *  idempotent within a test run and the daemon read costs ~150ms. */
const mintInfoCache = new Map<string, MintNutInfo>();

export const mint = {
	getInfo(config: ConfigInfo): MintNutInfo {
		const cached = mintInfoCache.get(config.name);
		if (cached) return cached;
		// 127.0.0.1 not localhost — cdk-mintd's container has no `localhost`
		// entry in /etc/hosts. nutshell ships curl, cdk-mintd ships wget;
		// `sh -c` chains so the call survives whichever tool is in $PATH.
		const url = `http://127.0.0.1:${config.mintPort}/v1/info`;
		const cmd = `curl -fsS ${url} 2>/dev/null || wget -qO- ${url}`;
		const out = dockerExec(['exec', config.containers.mint, 'sh', '-c', cmd]);
		const info = JSON.parse(out) as MintNutInfo;
		mintInfoCache.set(config.name, info);
		return info;
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
