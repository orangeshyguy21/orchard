/**
 * Source-of-truth readers for differential specs. Reached via `docker exec`
 * into the regtest containers — no certs or macaroons leave the container.
 */

/* Native Dependencies */
import {btcCli, btcCliJson, lndCliJson, clnCliJson} from './docker-cli';
import {containerForNode, isLnd, type ConfigInfo, type LnNode} from './config';

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
		return isLnd(config, node) ? lndCliJson(container, ['getinfo']) : clnCliJson(container, ['getinfo']);
	},
};
