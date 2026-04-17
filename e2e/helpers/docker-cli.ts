/**
 * `docker exec` into regtest containers to reach bitcoin-cli / lncli /
 * lightning-cli — avoids shipping TLS certs and macaroons to the host.
 * Sync because Lightning latency (~seconds) dwarfs exec overhead (~100ms).
 */

/* Core Dependencies */
import {execFileSync} from 'child_process';

function dockerExec(args: string[]): string {
	return execFileSync('docker', args, {encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe']}).trim();
}

export function btcCli(container: string, args: string[]): string {
	return dockerExec(['exec', container, 'bitcoin-cli', '-regtest', '-rpcuser=polar', '-rpcpassword=polar', ...args]);
}

export function btcCliJson<T = unknown>(container: string, args: string[]): T {
	return JSON.parse(btcCli(container, args)) as T;
}

export function lndCli(container: string, args: string[]): string {
	return dockerExec(['exec', container, 'lncli', '--lnddir=/home/lnd/.lnd', '--network=regtest', ...args]);
}

export function lndCliJson<T = unknown>(container: string, args: string[]): T {
	return JSON.parse(lndCli(container, args)) as T;
}

export function clnCli(container: string, args: string[]): string {
	return dockerExec(['exec', container, 'lightning-cli', '--lightning-dir=/home/clightning/.lightning', '--network=regtest', ...args]);
}

export function clnCliJson<T = unknown>(container: string, args: string[]): T {
	return JSON.parse(clnCli(container, args)) as T;
}
