/**
 * Lightning source-of-truth reads via `lncli` (LND) or `lightning-cli` (CLN)
 * in the orchard-side LN container. Most calls are cached; balances move
 * mid-test and stay uncached.
 */

/* Native Dependencies */
import {lndCliJson, clnCliJson} from './docker-cli';
import {cached} from './_cache';
import {containerForNode, isLnd, lndDirForNode} from '@e2e/helpers/config';
import type {ConfigInfo, LnNode} from '@e2e/types/config';

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

	/** Local channel balance (sats) on the orchard-side LN node, summed across
	 *  open NON-asset channels. Matches what `orc-mint-general-balance-sheet`
	 *  displays in the bitcoin row's assets cell — its
	 *  `lightning_balance.open.local_balance`, which Orchard's `buildChannelSummary`
	 *  computes by filtering `channels.filter((c) => c.asset === null)` then
	 *  summing each channel's `local_balance`. NOT cached: channel balances
	 *  move whenever a payment routes through the node mid-test.
	 *
	 *  LND: `lncli listchannels` rows where `custom_channel_data` is empty (the
	 *  same non-asset filter `parseLndCustomChannelData` uses upstream). Note we
	 *  do NOT use `lncli channelbalance` — it aggregates ALL channels including
	 *  asset ones, which inflates the value on tapd-enabled stacks.
	 *  CLN: sum `to_us_msat` across `listpeerchannels` rows in `CHANNELD_NORMAL`
	 *  (CLN has no asset-channel concept, so no filter needed beyond state),
	 *  then truncate-divide by 1000 to match the cln helper's sat conversion. */
	localChannelBalance(config: ConfigInfo): number {
		if (config.ln === false) throw new Error(`no LN on ${config.name}`);
		const container = config.containers.lnOrchard;
		if (config.ln === 'lnd') {
			const lc = lndCliJson<{channels: Array<{local_balance?: string; custom_channel_data?: string}>}>(
				container,
				['listchannels'],
				lndDirForNode(config, 'orchard'),
			);
			return lc.channels
				.filter((c) => !c.custom_channel_data || c.custom_channel_data === '')
				.reduce((sum, c) => sum + parseInt(c.local_balance ?? '0', 10), 0);
		}
		// cln
		const lpc = clnCliJson<{channels: Array<{state: string; to_us_msat: number}>}>(container, ['listpeerchannels']);
		const total_msat = lpc.channels
			.filter((c) => c.state === 'CHANNELD_NORMAL')
			.reduce((sum, c) => sum + Number(c.to_us_msat ?? 0), 0);
		return Math.floor(total_msat / 1000);
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

	/** Normalized "is this LN node fully synced" boolean, matching what
	 *  `orc-lightning-general-info`'s `state` computed renders:
	 *    state = error ? 'offline' : (synced ? 'online' : 'syncing')
	 *
	 *  LND emits `synced_to_chain` / `synced_to_graph` directly. CLN has no
	 *  such field — sync state is encoded as the *absence* of the
	 *  `warning_lightningd_sync` / `warning_bitcoind_sync` fields on getinfo.
	 *
	 *  On regtest LND, `synced_to_chain` flips false when no fresh blocks
	 *  have been mined recently (no continuous block flow), so this helper
	 *  legitimately returns false on idle LND stacks. CLN's regtest behavior
	 *  is gentler — its sync warnings only fire on real desync, not idle. */
	synced(config: ConfigInfo, node: LnNode = 'orchard'): boolean {
		const info = ln.getInfo(config, node);
		if (isLnd(config, node)) {
			const i = info as {synced_to_chain?: boolean; synced_to_graph?: boolean};
			return !!i.synced_to_chain && !!i.synced_to_graph;
		}
		const i = info as {warning_lightningd_sync?: string | null; warning_bitcoind_sync?: string | null};
		return !i.warning_lightningd_sync && !i.warning_bitcoind_sync;
	},
};
