/**
 * Bitcoin source-of-truth reads via `bitcoin-cli` in the stack's bitcoind
 * container. Cached per worker — chain state is monotonically advancing
 * but reads at the same height are idempotent.
 */

/* Native Dependencies */
import {btcCli, btcCliJson} from './docker-cli';
import {cached} from './_cache';
import {containerBitcoind} from '@e2e/helpers/config';
import type {ConfigInfo} from '@e2e/types/config';

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
