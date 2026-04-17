/**
 * Tests read the active config via `testInfo.project.name` and pass it into
 * helpers. This lets a single shared spec run against every config without
 * per-spec plumbing.
 */

export type ConfigName = 'lnd-nutshell-sqlite' | 'lnd-cdk-sqlite' | 'cln-cdk-postgres' | 'cln-nutshell-postgres';

export type LnType = 'lnd' | 'cln';
export type MintType = 'nutshell' | 'cdk';
export type DbType = 'sqlite' | 'postgres';

/** Named LN peer within a config's topology. `far` is always LND. */
export type LnNode = 'orchard' | 'alice' | 'far';

/** Seed admin used by both e2e tiers. Must match across tiers so the second
 *  tier to run against a shared stack can log in with the same credentials. */
export const TEST_ADMIN = {name: 'admin', password: 'orchard-e2e-admin-pw'} as const;

export interface ConfigInfo {
	name: ConfigName;
	ln: LnType;
	mint: MintType;
	db: DbType;
	tapd: boolean;
	/** Orchard URL (what Playwright `baseURL` resolves to). */
	orchardUrl: string;
	/** Admin seed used by fund/config; matches SETUP_KEY in the config's env file. */
	setupKey: string;
	containers: {
		bitcoind: string;
		/** Orchard's managed LN node. */
		lnOrchard: string;
		/** External peer connected directly to orchard (inbound liquidity). */
		lnAlice: string;
		/** Far-side peer forcing routing through orchard (outbound / forwarding). */
		lnFar: string;
	};
}

const BASE = {
	setupKey: 'orchard-e2e-admin-key',
};

export const CONFIGS: Record<ConfigName, ConfigInfo> = {
	'lnd-nutshell-sqlite': {
		name: 'lnd-nutshell-sqlite',
		ln: 'lnd',
		mint: 'nutshell',
		db: 'sqlite',
		tapd: false,
		orchardUrl: 'http://localhost:3321',
		...BASE,
		containers: {
			bitcoind: 'lnd-nutshell-sqlite-bitcoind',
			lnOrchard: 'lnd-nutshell-sqlite-lnd-orchard',
			lnAlice: 'lnd-nutshell-sqlite-lnd-alice',
			lnFar: 'lnd-nutshell-sqlite-lnd-bob',
		},
	},
	'lnd-cdk-sqlite': {
		name: 'lnd-cdk-sqlite',
		ln: 'lnd',
		mint: 'cdk',
		db: 'sqlite',
		tapd: true,
		orchardUrl: 'http://localhost:3323',
		...BASE,
		containers: {
			bitcoind: 'lnd-cdk-sqlite-bitcoind',
			lnOrchard: 'lnd-cdk-sqlite-lnd-orchard',
			lnAlice: 'lnd-cdk-sqlite-lnd-alice',
			lnFar: 'lnd-cdk-sqlite-lnd-bob',
		},
	},
	'cln-cdk-postgres': {
		name: 'cln-cdk-postgres',
		ln: 'cln',
		mint: 'cdk',
		db: 'postgres',
		tapd: false,
		orchardUrl: 'http://localhost:3322',
		...BASE,
		containers: {
			bitcoind: 'cln-cdk-postgres-bitcoind',
			lnOrchard: 'cln-cdk-postgres-cln-orchard',
			lnAlice: 'cln-cdk-postgres-cln-alice',
			lnFar: 'cln-cdk-postgres-lnd-carol',
		},
	},
	'cln-nutshell-postgres': {
		name: 'cln-nutshell-postgres',
		ln: 'cln',
		mint: 'nutshell',
		db: 'postgres',
		tapd: false,
		orchardUrl: 'http://localhost:3324',
		...BASE,
		containers: {
			bitcoind: 'cln-nutshell-postgres-bitcoind',
			lnOrchard: 'cln-nutshell-postgres-cln-orchard',
			lnAlice: 'cln-nutshell-postgres-cln-alice',
			lnFar: 'cln-nutshell-postgres-lnd-carol',
		},
	},
};

export function getConfig(name: string): ConfigInfo {
	if (!(name in CONFIGS)) {
		throw new Error(`Unknown config "${name}" — valid: ${Object.keys(CONFIGS).join(', ')}`);
	}
	return CONFIGS[name as ConfigName];
}

/** Resolve the docker container name for a named LN node in this config. */
export function containerForNode(config: ConfigInfo, node: LnNode): string {
	switch (node) {
		case 'orchard':
			return config.containers.lnOrchard;
		case 'alice':
			return config.containers.lnAlice;
		case 'far':
			return config.containers.lnFar;
	}
}

/** True if the named node runs LND. `far` is always LND regardless of config.ln. */
export function isLnd(config: ConfigInfo, node: LnNode): boolean {
	if (node === 'far') return true;
	return config.ln === 'lnd';
}
