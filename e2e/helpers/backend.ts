/**
 * Source-of-truth readers for differential specs, via `docker exec` into the
 * regtest containers — no certs or macaroons leave the container. Reads are
 * memoized per worker process via `cached()`; regtest fixtures don't mutate
 * mid-run, so cache-once-per-process is safe.
 */

/* Core Dependencies */
import {execFileSync} from 'child_process';
/* Native Dependencies */
import {btcCli, btcCliJson, dockerExec, lndCliJson, clnCliJson} from './docker-cli';
import {containerBitcoind, containerForNode, isLnd, lndDirForNode, type ConfigInfo, type LnNode, type MintUnit} from './config';

const _cache = new Map<string, unknown>();

/** Memoize an idempotent backend read. Key is the only knob; pass enough
 *  identity (config name + args) to disambiguate. */
function cached<T>(key: string, getter: () => T): T {
	if (_cache.has(key)) return _cache.get(key) as T;
	const v = getter();
	_cache.set(key, v);
	return v;
}

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

/** LN reads — dispatches to lncli or lightning-cli based on config.ln. */
export const ln = {
	getInfo(config: ConfigInfo, node: LnNode = 'orchard'): Record<string, unknown> {
		return cached(`ln.getInfo:${config.name}:${node}`, () => {
			const container = containerForNode(config, node);
			return isLnd(config, node)
				? lndCliJson(container, ['getinfo'], lndDirForNode(config, node))
				: clnCliJson(container, ['getinfo']);
		});
	},

	/**
	 * Total on-chain wallet sats for the named node. Matches what Orchard's
	 * `lightning_wallet` resolver aggregates (sum of addresses' balances) —
	 * channel-committed funds live elsewhere.
	 */
	onchainSats(config: ConfigInfo, node: LnNode = 'orchard'): number {
		return cached(`ln.onchainSats:${config.name}:${node}`, () => {
			const container = containerForNode(config, node);
			if (isLnd(config, node)) {
				const bal = lndCliJson<{total_balance: string}>(container, ['walletbalance'], lndDirForNode(config, node));
				return parseInt(bal.total_balance, 10);
			}
			const funds = clnCliJson<{outputs: {amount_msat: number}[]}>(container, ['listfunds']);
			return funds.outputs.reduce((sum, o) => sum + Math.floor(Number(o.amount_msat) / 1000), 0);
		});
	},

	/** Local channel balance (sats) on the orchard-side LN node, summed across
	 *  open NON-asset channels. Matches what `orc-mint-general-balance-sheet`
	 *  displays in the bitcoin row's assets cell — its
	 *  `lightning_balance.open.local_balance`, which Orchard's `buildChannelSummary`
	 *  computes by filtering `channels.filter((c) => c.asset === null)` then
	 *  summing each channel's `local_balance`. NOT cached: channel balances
	 *  move whenever a payment routes through the node mid-test.
	 *
	 *  LND: `lncli listchannels` rows where `custom_channel_data` is empty (the
	 *  same non-asset filter `parseLndCustomChannelData` uses upstream). Note we
	 *  do NOT use `lncli channelbalance` — it aggregates ALL channels including
	 *  asset ones, which inflates the value on tapd-enabled stacks.
	 *  CLN: sum `to_us_msat` across `listpeerchannels` rows in `CHANNELD_NORMAL`
	 *  (CLN has no asset-channel concept, so no filter needed beyond state),
	 *  then truncate-divide by 1000 to match the cln helper's sat conversion. */
	localChannelBalance(config: ConfigInfo): number {
		if (config.ln === false) throw new Error(`no LN on ${config.name}`);
		const container = config.containers.lnOrchard;
		if (config.ln === 'lnd') {
			const lc = lndCliJson<{channels: Array<{local_balance?: string; custom_channel_data?: string}>}>(
				container,
				['listchannels'],
				lndDirForNode(config, 'orchard'),
			);
			return lc.channels
				.filter((c) => !c.custom_channel_data || c.custom_channel_data === '')
				.reduce((sum, c) => sum + parseInt(c.local_balance ?? '0', 10), 0);
		}
		// cln
		const lpc = clnCliJson<{channels: Array<{state: string; to_us_msat: number}>}>(container, ['listpeerchannels']);
		const total_msat = lpc.channels
			.filter((c) => c.state === 'CHANNELD_NORMAL')
			.reduce((sum, c) => sum + Number(c.to_us_msat ?? 0), 0);
		return Math.floor(total_msat / 1000);
	},

	/** Count of the node's channels that do NOT carry taproot-asset metadata.
	 *  Mirrors the orc-lightning-general-channel-summary component's sat-row
	 *  filter (channels with empty `custom_channel_data`). LND only — CLN has
	 *  no asset-channel concept. */
	satChannelCount(config: ConfigInfo, node: LnNode = 'orchard', opts: {activeOnly?: boolean} = {}): number {
		return cached(`ln.satChannelCount:${config.name}:${node}:${!!opts.activeOnly}`, () =>
			countChannels(config, node, opts, (c) => !c.custom_channel_data || c.custom_channel_data === ''),
		);
	},

	/** Count of the node's channels that DO carry taproot-asset metadata
	 *  (non-empty `custom_channel_data`). Mirrors the tapass-row filter in
	 *  orc-lightning-general-channel-summary. LND-only (integrated tapd). */
	assetChannelCount(config: ConfigInfo, node: LnNode = 'orchard', opts: {activeOnly?: boolean} = {}): number {
		return cached(`ln.assetChannelCount:${config.name}:${node}:${!!opts.activeOnly}`, () =>
			countChannels(config, node, opts, (c) => !!c.custom_channel_data && c.custom_channel_data !== ''),
		);
	},

	/** Sat-row channel count as the dashboard's channel-summary card sees it.
	 *  Dispatches lnd → `satChannelCount` (filters by `custom_channel_data`);
	 *  cln → getinfo's `num_active_channels (+ num_inactive_channels)` because
	 *  cln has no asset-channel concept. */
	openSatChannelCount(config: ConfigInfo, opts: {activeOnly?: boolean} = {}): number {
		if (config.ln === 'lnd') return ln.satChannelCount(config, 'orchard', opts);
		const info = ln.getInfo(config) as {num_active_channels?: number; num_inactive_channels?: number};
		const active = info.num_active_channels ?? 0;
		if (opts.activeOnly) return active;
		return active + (info.num_inactive_channels ?? 0);
	},

	/** Normalized "is this LN node fully synced" boolean, matching what
	 *  `orc-lightning-general-info`'s `state` computed renders:
	 *    state = error ? 'offline' : (synced ? 'online' : 'syncing')
	 *
	 *  LND emits `synced_to_chain` / `synced_to_graph` directly. CLN has no
	 *  such field — sync state is encoded as the *absence* of the
	 *  `warning_lightningd_sync` / `warning_bitcoind_sync` fields on getinfo.
	 *
	 *  On regtest LND, `synced_to_chain` flips false when no fresh blocks
	 *  have been mined recently (no continuous block flow), so this helper
	 *  legitimately returns false on idle LND stacks. CLN's regtest behavior
	 *  is gentler — its sync warnings only fire on real desync, not idle. */
	synced(config: ConfigInfo, node: LnNode = 'orchard'): boolean {
		const info = ln.getInfo(config, node);
		if (isLnd(config, node)) {
			const i = info as {synced_to_chain?: boolean; synced_to_graph?: boolean};
			return !!i.synced_to_chain && !!i.synced_to_graph;
		}
		const i = info as {warning_lightningd_sync?: string | null; warning_bitcoind_sync?: string | null};
		return !i.warning_lightningd_sync && !i.warning_bitcoind_sync;
	},
};

/** NUT-06 `/v1/info` shape, narrowed to the fields the dashboard's mint
 *  card renders. The full Cashu spec includes `pubkey`, `nuts`, etc. —
 *  add fields here as specs need them. `urls` is optional in NUT-06 and
 *  null/missing on fixtures that don't advertise public URLs. */
export type MintNutInfo = {
	name?: string | null;
	description?: string | null;
	description_long?: string | null;
	icon_url?: string | null;
	urls?: string[] | null;
	version?: string;
};

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
function parseSqlBoolean(s: string): boolean {
	return s === 't' || s === '1' || s === 'true';
}

/** Run a one-shot SQL read against the stack's mint database, returning the
 *  raw stdout (whitespace-trimmed). Postgres uses `psql -tAc` for terse
 *  output; sqlite goes through `sqliteCopyAndQuery`. */
function mintDbQuery(config: ConfigInfo, sql: string): string {
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

export const mint = {
	/** Read mint state straight from the daemon. Both nutshell and cdk
	 *  expose NUT-06 at `/v1/info` over their in-container loopback port,
	 *  reachable via docker exec. */
	getInfo(config: ConfigInfo): MintNutInfo {
		return cached(`mint.getInfo:${config.name}`, () => {
			// 127.0.0.1 not localhost — cdk-mintd's container has no `localhost`
			// entry in /etc/hosts. nutshell ships curl, cdk-mintd ships wget;
			// `sh -c` chains so the call survives whichever tool is in $PATH.
			const url = `http://127.0.0.1:${config.mintPort}/v1/info`;
			const cmd = `curl -fsS ${url} 2>/dev/null || wget -qO- ${url}`;
			const out = dockerExec(['exec', config.containers.mint, 'sh', '-c', cmd]);
			return JSON.parse(out) as MintNutInfo;
		});
	},

	/** Outstanding ecash liability for the given mint unit, summed across all
	 *  keysets of that unit, straight from the mint database — what
	 *  `orc-mint-general-balance-sheet` displays as the row's liabilities
	 *  figure (the component's `getRows` aggregates per-keyset values into
	 *  one row per unit the same way). NOT cached: ecash supply mutates as
	 *  tests mint/melt; this is the differential oracle the spec asserts UI
	 *  values against.
	 *
	 *  cdk: `keyset_amounts.total_issued - total_redeemed` (matches Orchard's
	 *  `getBalances` resolver in `cdk.service.ts`), joined to `keyset` for unit.
	 *  nutshell: the `balance` view (defined as `s_issued - s_used`), keyed
	 *  by `keyset`, joined to `keysets` for unit. */
	balance(config: ConfigInfo, unit: MintUnit): number {
		const sql =
			config.mint === 'cdk'
				? `SELECT COALESCE(SUM(total_issued - total_redeemed), 0) FROM keyset_amounts ka JOIN keyset k ON k.id = ka.keyset_id WHERE k.unit = '${unit}'`
				: `SELECT COALESCE(SUM(b.balance), 0) FROM balance b JOIN keysets k ON k.id = b.keyset WHERE k.unit = '${unit}'`;
		const out = mintDbQuery(config, sql);
		return parseInt(out, 10);
	},

	/** Total fees the mint has collected for the given unit, summed across all
	 *  its keysets, straight from the mint database — what
	 *  `orc-mint-general-balance-sheet` displays in the expanded row's
	 *  "Fee revenue" high-card (the component's `getRows` aggregates per-keyset
	 *  `keyset.fees_paid` into one row per unit the same way). NOT cached:
	 *  fees grow as melts/swaps land mid-test.
	 *
	 *  cdk: `keyset_amounts.fee_collected`, joined to `keyset` for unit
	 *  (matches Orchard's `getKeysets` resolver, which selects this column
	 *  aliased as `fees_paid`).
	 *  nutshell: the `keysets` table carries `fees_paid` directly. */
	feesPaid(config: ConfigInfo, unit: MintUnit): number {
		const sql =
			config.mint === 'cdk'
				? `SELECT COALESCE(SUM(ka.fee_collected), 0) FROM keyset_amounts ka JOIN keyset k ON k.id = ka.keyset_id WHERE k.unit = '${unit}'`
				: `SELECT COALESCE(SUM(fees_paid), 0) FROM keysets WHERE unit = '${unit}'`;
		const out = mintDbQuery(config, sql);
		return parseInt(out, 10);
	},

	/** Provisioned keysets straight from the mint database, in the same shape
	 *  the bs row-chip renders (`Gen N` + `NNN ppk`). NOT cached: rotation can
	 *  add new keysets mid-test.
	 *
	 *  cdk stores the parsed `derivation_path_index` as its own column; nutshell
	 *  only stores the full `derivation_path` and Orchard's nutshell service
	 *  extracts the trailing `/N'?$` segment as the index — this helper mirrors
	 *  that extraction. The legacy-keyset reconciler (`reconcileLegacyKeysetIndices`)
	 *  in nutshell.service.ts only kicks in for keysets with `valid_from = null`,
	 *  which the regtest fixtures don't produce, so the simple regex matches
	 *  Orchard's output for every keyset in test stacks. */
	keysets(config: ConfigInfo): Array<{
		id: string;
		unit: MintUnit;
		active: boolean;
		derivation_path_index: number;
		input_fee_ppk: number;
	}> {
		const sql =
			config.mint === 'cdk'
				? `SELECT id, unit, active, derivation_path_index, COALESCE(input_fee_ppk, 0) FROM keyset ORDER BY id`
				: `SELECT id, unit, active, derivation_path, COALESCE(input_fee_ppk, 0) FROM keysets ORDER BY id`;
		const out = mintDbQuery(config, sql);
		if (out === '') return [];
		return out.split('\n').map((line) => {
			const [id, unit, active_str, third, ppk_str] = line.split('|');
			// cdk's third column is the parsed index; nutshell's is the full path
			// and Orchard extracts the trailing `/N'?` segment as the index.
			const nutshell_match = third.match(/\/(\d+)'?$/);
			const derivation_path_index =
				config.mint === 'cdk' ? parseInt(third, 10) : nutshell_match ? parseInt(nutshell_match[1], 10) : 0;
			return {
				id,
				unit: unit as MintUnit,
				active: parseSqlBoolean(active_str),
				derivation_path_index,
				input_fee_ppk: parseInt(ppk_str, 10),
			};
		});
	},
};

/** Path to Orchard's own sqlite database inside the orchard container —
 *  where Orchard persists settings, oracle backfills, analytics checkpoints,
 *  users. Distinct from the mint daemon's DB. */
const ORCHARD_SQLITE_PATH = '/app/data/orchard.db';

function orchardDbQuery(config: ConfigInfo, sql: string): string {
	return sqliteCopyAndQuery(`${config.name}-orchard`, ORCHARD_SQLITE_PATH, `/tmp/orc-e2e-orchard-${config.name}.db`, sql);
}

export const orchard = {
	/** Latest oracle price stored by the Backfill Prices flow, in integer USD
	 *  per BTC (the `utxoracle.price` column). E.g. `50000` means $50,000/BTC.
	 *  Returns null if the table is empty — callers should already be gated
	 *  by `oracleHasRecentData` readiness, so a null here is a real failure. */
	oraclePrice(config: ConfigInfo): number | null {
		const out = orchardDbQuery(config, 'SELECT price FROM utxoracle ORDER BY date DESC LIMIT 1');
		if (out === '') return null;
		return parseInt(out, 10);
	},
};

/** Single asset record from `tapcli assets list`, narrowed to the fields
 *  specs read. tapd's response carries many more — extend as needed. */
export type TapdAsset = {
	asset_genesis: {name: string; asset_id: string; asset_type: string};
	asset_group?: {tweaked_group_key?: string};
	amount: string;
	decimal_display?: {decimal_display?: number};
	version: string;
};

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

function countChannels(
	config: ConfigInfo,
	node: LnNode,
	opts: {activeOnly?: boolean},
	predicate: (channel: {custom_channel_data?: string}) => boolean,
): number {
	if (!isLnd(config, node)) {
		throw new Error(`channel counting only implemented for LND nodes (got ${config.ln})`);
	}
	const container = containerForNode(config, node);
	const args = ['listchannels'];
	if (opts.activeOnly) args.push('--active_only');
	const listed = lndCliJson<{channels: Array<{custom_channel_data?: string}>}>(container, args, lndDirForNode(config, node));
	return listed.channels.filter(predicate).length;
}
