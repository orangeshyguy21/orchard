/**
 * Source-of-truth readers for differential specs. Reached via `docker exec`
 * into the regtest containers — no certs or macaroons leave the container.
 */

/* Native Dependencies */
import {btcCli, btcCliJson, lndCliJson, clnCliJson} from './docker-cli';
import {containerForNode, isLnd, lndDirForNode, type ConfigInfo, type LnNode} from './config';

export const btc = {
	blockCount(config: ConfigInfo): number {
		return btcCliJson<number>(config.containers.bitcoind, ['getblockcount']);
	},

	getBlockchainInfo(config: ConfigInfo): Record<string, unknown> {
		return btcCliJson(config.containers.bitcoind, ['getblockchaininfo']);
	},

	getNetworkInfo(config: ConfigInfo): Record<string, unknown> {
		return btcCliJson(config.containers.bitcoind, ['getnetworkinfo']);
	},

	/** Verbose form — returns an object keyed by txid (Orchard flattens to an array). */
	getRawMempool(config: ConfigInfo): Record<string, unknown> {
		return btcCliJson(config.containers.bitcoind, ['getrawmempool', 'true']);
	},

	getBestBlockHash(config: ConfigInfo): string {
		// Raw output: bitcoin-cli returns the hash as a bare hex string, not JSON.
		return btcCli(config.containers.bitcoind, ['getbestblockhash']);
	},

	/** Verbosity 2 — matches what Orchard's resolver uses. */
	getBlock(config: ConfigInfo, hash: string): Record<string, unknown> {
		return btcCliJson(config.containers.bitcoind, ['getblock', hash, '2']);
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
