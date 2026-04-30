/* Native Dependencies */
import {btcCli, lndCli, clnCli} from './docker-cli';
import {containerBitcoind, containerForNode, isLnd, lndDirForNode} from '@e2e/helpers/config';
import type {ConfigInfo, LnNode} from '@e2e/types/config';

/** Mine `blocks` regtest blocks to a throwaway address. */
export function mine(config: ConfigInfo, blocks: number): void {
	const addr = btcCli(containerBitcoind(config), ['getnewaddress']);
	btcCli(containerBitcoind(config), ['generatetoaddress', String(blocks), addr]);
}

/** Return the current chain height. */
export function chainHeight(config: ConfigInfo): number {
	return parseInt(btcCli(containerBitcoind(config), ['getblockcount']), 10);
}

/** Pay a bolt11 invoice from the named LN node. */
export function payInvoice(config: ConfigInfo, node: LnNode, bolt11: string): void {
	const container = containerForNode(config, node);
	if (isLnd(config, node)) {
		lndCli(container, ['payinvoice', '--force', bolt11], lndDirForNode(config, node));
	} else {
		clnCli(container, ['pay', bolt11]);
	}
}

/** Create a bolt11 invoice on the named LN node, return the payment request string. */
export function newInvoice(config: ConfigInfo, node: LnNode, amountSat: number, memo = 'e2e'): string {
	const container = containerForNode(config, node);
	if (isLnd(config, node)) {
		const out = lndCli(container, ['addinvoice', '--amt', String(amountSat), '--memo', memo], lndDirForNode(config, node));
		return JSON.parse(out).payment_request as string;
	}
	// CLN takes msat and requires a unique label per invoice.
	const out = clnCli(container, ['invoice', String(amountSat * 1000), `e2e-${Date.now()}`, memo]);
	return JSON.parse(out).bolt11 as string;
}
