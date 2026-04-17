import {execFileSync} from 'child_process';
import type {ConfigInfo} from './config';

/**
 * Drives regtest nodes via `docker exec` rather than shipping TLS certs
 * and macaroons to the host — same pattern as fund-{lnd,cln}-topology.sh.
 * Sync because Lightning latency (~seconds) dwarfs exec overhead (~100ms).
 */

function exec(args: string[]): string {
	return execFileSync('docker', args, {encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe']}).trim();
}

function bcli(container: string, args: string[]): string {
	return exec([
		'exec',
		container,
		'bitcoin-cli',
		'-regtest',
		'-rpcuser=polar',
		'-rpcpassword=polar',
		...args,
	]);
}

function lncli(container: string, args: string[]): string {
	return exec([
		'exec',
		container,
		'lncli',
		'--lnddir=/home/lnd/.lnd',
		'--network=regtest',
		...args,
	]);
}

function clncli(container: string, args: string[]): string {
	return exec([
		'exec',
		container,
		'lightning-cli',
		'--lightning-dir=/home/clightning/.lightning',
		'--network=regtest',
		...args,
	]);
}

/** Mine `blocks` regtest blocks to a throwaway address. */
export function mine(config: ConfigInfo, blocks: number): void {
	const addr = bcli(config.containers.bitcoind, ['getnewaddress']);
	bcli(config.containers.bitcoind, ['generatetoaddress', String(blocks), addr]);
}

/** Return the current chain height. */
export function chainHeight(config: ConfigInfo): number {
	return parseInt(bcli(config.containers.bitcoind, ['getblockcount']), 10);
}

/** Pay a bolt11 invoice from the named LN node. */
export function payInvoice(config: ConfigInfo, node: 'orchard' | 'alice' | 'far', bolt11: string): void {
	const container = containerForNode(config, node);
	if (isLnd(config, node)) {
		lncli(container, ['payinvoice', '--force', bolt11]);
	} else {
		clncli(container, ['pay', bolt11]);
	}
}

/** Create a bolt11 invoice on the named LN node, return the payment request string. */
export function newInvoice(config: ConfigInfo, node: 'orchard' | 'alice' | 'far', amountSat: number, memo = 'e2e'): string {
	const container = containerForNode(config, node);
	if (isLnd(config, node)) {
		const out = lncli(container, ['addinvoice', '--amt', String(amountSat), '--memo', memo]);
		return JSON.parse(out).payment_request as string;
	}
	const out = clncli(container, [
		'invoice',
		String(amountSat * 1000), // CLN takes msat
		`e2e-${Date.now()}`, // label must be unique
		memo,
	]);
	return JSON.parse(out).bolt11 as string;
}

// ── internals ──────────────────────────────────────────────────────────

function containerForNode(config: ConfigInfo, node: 'orchard' | 'alice' | 'far'): string {
	switch (node) {
		case 'orchard':
			return config.containers.lnOrchard;
		case 'alice':
			return config.containers.lnAlice;
		case 'far':
			return config.containers.lnFar;
	}
}

/**
 * The "far" node is always LND (lnd-bob in lnd configs, lnd-carol in cln configs)
 * so we can't just check config.ln — check per-node.
 */
function isLnd(config: ConfigInfo, node: 'orchard' | 'alice' | 'far'): boolean {
	if (node === 'far') return true;
	return config.ln === 'lnd';
}
