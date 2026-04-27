/**
 * Tests read the active config via `testInfo.project.name` and pass it into
 * helpers. This lets a single shared spec run against every config without
 * per-spec plumbing.
 */

import fs from 'node:fs';
import path from 'node:path';

export type ConfigName = 'lnd-nutshell-sqlite' | 'lnd-cdk-sqlite' | 'cln-cdk-postgres' | 'cln-nutshell-postgres' | 'fake-cdk-postgres';

export type LnType = 'lnd' | 'cln';
export type MintType = 'nutshell' | 'cdk';
export type DbType = 'sqlite' | 'postgres';
export type MintUnit = 'sat' | 'usd' | 'eur';

/** Named LN peer within a config's topology. `far` is always LND. */
export type LnNode = 'orchard' | 'alice' | 'far';

/** Seed admin used by both e2e tiers. Must match across tiers so the second
 *  tier to run against a shared stack can log in with the same credentials. */
/** Password must be ≥6 chars — enforced by the auth-init + signup forms. */
export const TEST_ADMIN = {name: 'admin', password: 'tester'} as const;

const BASE = {
	setupKey: 'orchard-e2e-admin-key',
};

interface BaseConfigInfo {
	name: ConfigName;
	mint: MintType;
	db: DbType;
	/** Stack runs a bitcoind container and Orchard boots with BITCOIN_TYPE.
	 *  False only on fake-cdk-postgres — that stack exercises Orchard's
	 *  no-bitcoin code path alongside its no-LN path. */
	bitcoin: boolean;
	tapd: boolean;
	/** Mint + LN backend both speak offers. */
	bolt12: boolean;
	/** Stack ships a `compose.mainchain.yml` overlay. The overlay is always
	 *  loaded when present, and `@mainchain` is always in this stack's grep. */
	mainchain: boolean;
	orchardUrl: string;
	setupKey: string;
}

/** Discriminated on `ln`: no-LN stacks (`ln: false`) have no LN containers
 *  at all, so accessing `lnOrchard` / `lnAlice` / `lnFar` on them is a
 *  compile error. Today the no-LN stack also has no `bitcoind` container. */
export type ConfigInfo =
	| (BaseConfigInfo & {
			ln: LnType;
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
			ln: false;
			containers: Record<string, never>;
	  });

/** The config-agnostic baseline stack. `@canary`-tagged tests run only here. */
export const CANARY: ConfigName = 'lnd-nutshell-sqlite';

/** Tags that match this stack's `grep`. Shared between `playwright.config.ts`
 *  and reporters so the rules live in one place. */
export function tagsFor(config: ConfigInfo): string[] {
	const tags = ['@all', `@${config.mint}`, `@${config.db}`];
	if (config.ln === false) {
		tags.push('@no-lightning');
	} else {
		tags.push(`@${config.ln}`, '@lightning');
	}
	if (config.bitcoin) tags.push('@bitcoin');
	else tags.push('@no-bitcoin');
	if (config.name === CANARY) tags.push('@canary');
	if (config.tapd) tags.push('@tapd');
	if (config.bolt12) tags.push('@bolt12');
	if (config.mainchain) tags.push('@mainchain');
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
		bitcoin: true,
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
		bitcoin: true,
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
		bitcoin: true,
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
		bitcoin: true,
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
		ln: false,
		mint: 'cdk',
		db: 'postgres',
		bitcoin: false,
		tapd: false,
		bolt12: false,
		mainchain: false,
		orchardUrl: 'http://localhost:3326',
		...BASE,
		containers: {},
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

/** Docker container name for a named LN node. Throws on no-LN stacks —
 *  callers should gate on `config.ln !== false` or rely on `@lnd`/`@cln`
 *  grep to skip. */
export function containerForNode(config: ConfigInfo, node: LnNode): string {
	if (config.ln === false) {
		throw new Error(`no LN nodes on no-LN stack ${config.name} — requested ${node}`);
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

/** Docker container name for the stack's bitcoind. Throws on no-bitcoin
 *  stacks — callers should rely on bitcoin-sensitive tag grep (e.g. `@canary`,
 *  `@lightning`) to skip, since fake-cdk-postgres has no bitcoind. */
export function containerBitcoind(config: ConfigInfo): string {
	if (!config.bitcoin) {
		throw new Error(`no bitcoind on ${config.name} — this stack runs without a bitcoin service`);
	}
	// Narrowing: bitcoin=false only coincides with ln=false today; TS can't
	// prove that from the bitcoin flag alone, so assert the LN-bearing arm.
	if (config.ln === false) {
		throw new Error(`unreachable: no-LN stack ${config.name} has bitcoin=true`);
	}
	return config.containers.bitcoind;
}

/** True if the named node runs LND. `far` is always LND. */
export function isLnd(config: ConfigInfo, node: LnNode): boolean {
	if (config.ln === false) return false;
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

/** Source-of-truth read for each stack's mint units. Parses the stack's
 *  `mintd.toml` (cdk) or `compose.yml` (nutshell) so this stays correct
 *  when operators change mint configs. `sat` is always the first unit —
 *  both cdk and nutshell provision it by default; `usd` / `eur` are
 *  opt-in via `supported_units` (cdk fake_wallet) or
 *  `MINT_BACKEND_BOLT11_USD` / `_EUR` in the nutshell service env.
 *  Run from the repo root (playwright's cwd). */
export function mintUnitsFor(config: ConfigInfo): MintUnit[] {
	const dir = path.resolve(process.cwd(), 'e2e', 'docker', 'configs', config.name);
	const stripComments = (raw: string): string => raw.split('\n').filter((l) => !l.trim().startsWith('#')).join('\n');
	const units: MintUnit[] = ['sat'];

	if (config.mint === 'cdk') {
		const toml = stripComments(fs.readFileSync(path.join(dir, 'mintd.toml'), 'utf8'));
		// [fake_wallet] supported_units = ["sat", "usd"] — real-LN cdk stacks
		// omit this block and serve only sat.
		const listed = [...toml.matchAll(/supported_units\s*=\s*\[([^\]]+)\]/g)].flatMap((m) =>
			[...m[1].matchAll(/"(sat|usd|eur)"/g)].map((mm) => mm[1] as MintUnit),
		);
		for (const u of listed) if (!units.includes(u)) units.push(u);
	} else {
		const compose = stripComments(fs.readFileSync(path.join(dir, 'compose.yml'), 'utf8'));
		if (/MINT_BACKEND_BOLT11_USD\s*=/.test(compose)) units.push('usd');
		if (/MINT_BACKEND_BOLT11_EUR\s*=/.test(compose)) units.push('eur');
	}
	return units;
}
