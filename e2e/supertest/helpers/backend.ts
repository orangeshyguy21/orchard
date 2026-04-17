/**
 * Source-of-truth readers for differential specs. Reached via `docker exec`
 * into the regtest containers — no certs or macaroons leave the container.
 * Phase 3.0 ships a minimum surface; grows with each new spec.
 */

/* Application Dependencies */
import {btcCliJson, lndCliJson, clnCliJson} from '../../helpers/docker-cli';
import {containerForNode, isLnd, type ConfigInfo, type LnNode} from '../../helpers/config';

export const btc = {
	blockCount(config: ConfigInfo): number {
		return btcCliJson<number>(config.containers.bitcoind, ['getblockcount']);
	},

	getBlockchainInfo(config: ConfigInfo): Record<string, unknown> {
		return btcCliJson(config.containers.bitcoind, ['getblockchaininfo']);
	},
};

/** LN reads — dispatches to lncli or lightning-cli based on config.ln. */
export const ln = {
	getInfo(config: ConfigInfo, node: LnNode = 'orchard'): Record<string, unknown> {
		const container = containerForNode(config, node);
		return isLnd(config, node) ? lndCliJson(container, ['getinfo']) : clnCliJson(container, ['getinfo']);
	},
};
