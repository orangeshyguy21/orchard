/**
 * Tests read the active config via `testInfo.project.name` and pass it into
 * helpers. This lets a single shared spec run against every config without
 * per-spec plumbing.
 */

export type ConfigName = 'lnd-nutshell-sqlite' | 'lnd-cdk-sqlite' | 'cln-cdk-postgres' | 'cln-nutshell-postgres' | 'fake-cdk-postgres';

export type LnType = 'lnd' | 'cln' | 'fake';
export type MintType = 'nutshell' | 'cdk';
export type DbType = 'sqlite' | 'postgres';

/** Named LN peer within a config's topology. `far` is always LND. */
export type LnNode = 'orchard' | 'alice' | 'far';

/** Seed admin used by both e2e tiers. Must match across tiers so the second
 *  tier to run against a shared stack can log in with the same credentials. */
/** Password must be ≥6 chars — enforced by the auth-init + signup forms. */
export const TEST_ADMIN = {name: 'admin', password: 'testere2e'} as const;

const BASE = {
	setupKey: 'orchard-e2e-admin-key',
};

interface BaseConfigInfo {
	name: ConfigName;
	mint: MintType;
	db: DbType;
	tapd: boolean;
	/** Mint + LN backend both speak offers. */
	bolt12: boolean;
	/** Stack ships a `compose.mainchain.yml` overlay. Gated on `E2E_MAINCHAIN=1`
	 *  — the `@mainchain` grep tag is added under the same env, so specs
	 *  skip cleanly on plain runs. */
	mainchain: boolean;
	orchardUrl: string;
	setupKey: string;
}

/** Discriminated on `ln`: fake-LN stacks have no LN containers at all, so
 *  accessing `lnOrchard` / `lnAlice` / `lnFar` on them is a compile error. */
export type ConfigInfo =
	| (BaseConfigInfo & {
			ln: Exclude<LnType, 'fake'>;
			containers: {
				bitcoind: string;
				/** Orchard's managed LN node. */
				lnOrchard: string;
				/** External peer connected directly to orchard (inbound liquidity). */
				lnAlice: string;
				/** Far-side peer forcing routing through orchard (outbound / forwarding). */
				lnFar: string;
			};
	  })
	| (BaseConfigInfo & {
			ln: 'fake';
			containers: {bitcoind: string};
	  });

/** The config-agnostic baseline stack. `@canary`-tagged tests run only here. */
export const CANARY: ConfigName = 'lnd-nutshell-sqlite';

/** Tags that match this stack's `grep`. Shared between `playwright.config.ts`
 *  and reporters so the rules live in one place. */
export function tagsFor(config: ConfigInfo): string[] {
	const tags = ['@all', `@${config.ln}`, `@${config.mint}`, `@${config.db}`];
	tags.push(config.ln === 'fake' ? '@no-lightning' : '@lightning');
	if (config.name === CANARY) tags.push('@canary');
	if (config.tapd) tags.push('@tapd');
	if (config.bolt12) tags.push('@bolt12');
	if (config.mainchain && process.env.E2E_MAINCHAIN === '1') tags.push('@mainchain');
	return tags;
}

/** Port slice of a config's `orchardUrl` (the same suffix appended to
 *  Playwright project names). Returns the digits only, no leading colon. */
export function portOf(config: ConfigInfo): string {
	const m = /:(\d+)/.exec(config.orchardUrl);
	return m ? m[1] : '';
}

export const CONFIGS: Record<ConfigName, ConfigInfo> = {
	'lnd-nutshell-sqlite': {
		name: 'lnd-nutshell-sqlite',
		ln: 'lnd',
		mint: 'nutshell',
		db: 'sqlite',
		tapd: false,
		bolt12: false,
		mainchain: false,
		orchardUrl: 'http://localhost:3322',
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
		bolt12: false,
		mainchain: false,
		orchardUrl: 'http://localhost:3324',
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
		bolt12: true,
		mainchain: false,
		orchardUrl: 'http://localhost:3323',
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
		bolt12: false,
		mainchain: true,
		orchardUrl: 'http://localhost:3325',
		...BASE,
		containers: {
			bitcoind: 'cln-nutshell-postgres-bitcoind',
			lnOrchard: 'cln-nutshell-postgres-cln-orchard',
			lnAlice: 'cln-nutshell-postgres-cln-alice',
			lnFar: 'cln-nutshell-postgres-lnd-carol',
		},
	},
	'fake-cdk-postgres': {
		name: 'fake-cdk-postgres',
		ln: 'fake',
		mint: 'cdk',
		db: 'postgres',
		tapd: false,
		bolt12: false,
		mainchain: false,
		orchardUrl: 'http://localhost:3326',
		...BASE,
		containers: {
			bitcoind: 'fake-cdk-postgres-bitcoind',
		},
	},
};

/** Accepts bare config names (`cln-nutshell-postgres`) or Playwright project
 *  names with a port suffix (`cln-nutshell-postgres:3325`) — the suffix is
 *  decorative, added in `playwright.config.ts` so the list reporter surfaces
 *  which Orchard instance a test ran against. */
export function getConfig(name: string): ConfigInfo {
	const bareName = name.replace(/:\d+$/, '');
	if (!(bareName in CONFIGS)) {
		throw new Error(`Unknown config "${name}" — valid: ${Object.keys(CONFIGS).join(', ')}`);
	}
	return CONFIGS[bareName as ConfigName];
}

/** Docker container name for a named LN node. Throws on fake-LN stacks —
 *  callers should gate on `config.ln !== 'fake'` or rely on `@lnd`/`@cln`
 *  grep to skip. */
export function containerForNode(config: ConfigInfo, node: LnNode): string {
	if (config.ln === 'fake') {
		throw new Error(`no LN nodes on fake-LN stack ${config.name} — requested ${node}`);
	}
	switch (node) {
		case 'orchard':
			return config.containers.lnOrchard;
		case 'alice':
			return config.containers.lnAlice;
		case 'far':
			return config.containers.lnFar;
	}
}

/** True if the named node runs LND. `far` is always LND. */
export function isLnd(config: ConfigInfo, node: LnNode): boolean {
	if (config.ln === 'fake') return false;
	if (node === 'far') return true;
	return config.ln === 'lnd';
}

/** lnd's data dir inside the container. In lnd-cdk-sqlite, orchard+alice run
 *  litd (embedded lnd at /home/litd/.lnd); bob and every other config use
 *  the polar-lnd convention /home/lnd/.lnd. */
export function lndDirForNode(config: ConfigInfo, node: LnNode): string {
	if (config.name === 'lnd-cdk-sqlite' && (node === 'orchard' || node === 'alice')) {
		return '/home/litd/.lnd';
	}
	return '/home/lnd/.lnd';
}
