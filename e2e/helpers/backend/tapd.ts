/**
 * tapd source-of-truth reads via `tapcli` inside the litd container (LND-only,
 * since tapd integrates with LND's litd flavour). Throws on stacks where
 * `config.tapd === false`.
 */

/* Native Dependencies */
import {dockerExec} from './docker-cli';
import {cached} from './_cache';
import type {ConfigInfo} from '@e2e/types/config';
import type {TapdAsset} from '@e2e/types/tapd';

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
