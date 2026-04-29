/**
 * Shared SQL transport primitives for backend readers that need to query
 * the mint daemon's database or Orchard's own database. The cdk/nutshell/
 * orchard containers don't ship a sqlite3 binary, so sqlite reads go via
 * `docker cp` into /tmp + a host-side `sqlite3` invocation. Postgres reads
 * go via `docker exec psql -tAc`.
 */

/* Core Dependencies */
import {execFileSync} from 'child_process';
/* Native Dependencies */
import {dockerExec} from './docker-cli';
import type {ConfigInfo} from '@e2e/types/config';

/** Postgres database name per stack — every stack uses user `cashu`/pass `cashu`,
 *  but the database name is set by each compose file's `POSTGRES_DB` env. */
const MINT_PG_DB: Partial<Record<ConfigInfo['name'], string>> = {
	'fake-cdk-postgres': 'cdk_fake',
	'cln-cdk-postgres': 'cdk',
	'cln-nutshell-postgres': 'nutshell',
};

/** Path to the mint daemon's sqlite file inside its container. cdk-mintd
 *  writes a single `cdk-mintd.sqlite`; nutshell writes `mint.sqlite3`. */
const MINT_SQLITE_PATH: Record<'cdk' | 'nutshell', string> = {
	cdk: '/app/data/cdk-mintd.sqlite',
	nutshell: '/app/data/mint.sqlite3',
};

/** Path to Orchard's own sqlite database inside the orchard container —
 *  where Orchard persists settings, oracle backfills, analytics checkpoints,
 *  users. Distinct from the mint daemon's DB. */
const ORCHARD_SQLITE_PATH = '/app/data/orchard.db';

/** Copy a WAL-mode sqlite db out of a container (main + `-wal`/`-shm` sidecars)
 *  and query it with local `sqlite3`. The cdk/nutshell/orchard containers
 *  don't ship a sqlite3 binary, so we have to query host-side. The sidecars
 *  matter — without them the cp'd db looks empty until the writer checkpoints. */
function sqliteCopyAndQuery(container: string, remote: string, local: string, sql: string): string {
	for (const suffix of ['', '-wal', '-shm']) {
		try {
			dockerExec(['cp', `${container}:${remote}${suffix}`, `${local}${suffix}`]);
		} catch {
			// sidecars may legitimately not exist if the writer has checkpointed
		}
	}
	return execFileSync('sqlite3', [local, sql], {encoding: 'utf8'}).trim();
}

/** Parse the boolean text emitted by either `psql -tA` (`'t'` / `'f'`) or
 *  `sqlite3` (`'1'` / `'0'`). */
export function parseSqlBoolean(s: string): boolean {
	return s === 't' || s === '1' || s === 'true';
}

/** Run a one-shot SQL read against the stack's mint database, returning the
 *  raw stdout (whitespace-trimmed). Postgres uses `psql -tAc` for terse
 *  output; sqlite goes through `sqliteCopyAndQuery`. */
export function mintDbQuery(config: ConfigInfo, sql: string): string {
	if (config.db === 'postgres') {
		const db = MINT_PG_DB[config.name];
		if (!db) throw new Error(`MINT_PG_DB missing entry for ${config.name}`);
		const container = `${config.name}-postgres`;
		return dockerExec(['exec', container, 'psql', '-U', 'cashu', '-d', db, '-tAc', sql]);
	}
	return sqliteCopyAndQuery(
		config.containers.mint,
		MINT_SQLITE_PATH[config.mint],
		`/tmp/orc-e2e-mint-${config.name}.sqlite3`,
		sql,
	);
}

export function orchardDbQuery(config: ConfigInfo, sql: string): string {
	return sqliteCopyAndQuery(`${config.name}-orchard`, ORCHARD_SQLITE_PATH, `/tmp/orc-e2e-orchard-${config.name}.db`, sql);
}
