/**
 * Mint Analytics Diagnostic Script
 *
 * Compares CDK mint database ground truth against the analytics_mint cache
 * to identify discrepancies in the cached analytics data.
 *
 * Usage:
 *   npm run debug:mint-analytics
 *   npm run debug:mint-analytics -- --mint-db /path/to/cdk.sqlite --db data/orchard.db --type cdk
 */

import Database from 'better-sqlite3';
import 'dotenv/config';

/* ============================================================================
   Configuration
   ============================================================================ */

const ARGS = parseArgs(process.argv.slice(2));
const MINT_DB_PATH = ARGS['mint-db'] || process.env.MINT_DATABASE || 'data/cdk-mintd.sqlite';
const DB_PATH = ARGS.db || 'data/orchard.db';
const MINT_TYPE = ARGS.type || 'cdk';

/* ============================================================================
   Types
   ============================================================================ */

interface MintQuoteRow {
	id: string;
	amount: number;
	unit: string;
	state: string;
	created_time: number;
	amount_paid: number;
	amount_issued: number;
	issued_time: number | null;
}

interface MeltQuoteRow {
	id: string;
	unit: string;
	amount: number;
	state: string;
	created_time: number;
	paid_time: number | null;
}

interface SwapRow {
	operation_id: string;
	unit: string;
	amount: number;
	fee: number;
	created_time: number;
}

interface ProofRow {
	amount: number;
	keyset_id: string;
	unit: string;
	state: string;
	created_time: number;
}

interface PromiseRow {
	amount: number;
	keyset_id: string;
	unit: string;
	created_time: number;
}

interface KeysetAmountRow {
	keyset_id: string;
	unit: string;
	total_issued: number;
	total_redeemed: number;
}

interface DbMetricRow {
	metric: string;
	unit: string;
	total: string;
	count: number;
}

interface DbKeysetMetricRow {
	metric: string;
	keyset_id: string;
	unit: string;
	total: string;
	count: number;
}

interface DbCheckpointRow {
	module: string;
	scope: string;
	data_type: string;
	last_index: number;
	updated_at: number;
}

interface GroundTruth {
	mint_quotes: MintQuoteRow[];
	melt_quotes: MeltQuoteRow[];
	swaps: SwapRow[];
	proofs: ProofRow[];
	promises: PromiseRow[];
	keyset_amounts: KeysetAmountRow[];
}

interface CachedData {
	unit_metrics: DbMetricRow[];
	keyset_metrics: DbKeysetMetricRow[];
	checkpoints: DbCheckpointRow[];
	total_records: number;
}

/* ============================================================================
   Helpers
   ============================================================================ */

/** Parses CLI arguments like --mint-db foo --db bar */
function parseArgs(argv: string[]): Record<string, string> {
	const args: Record<string, string> = {};
	for (let i = 0; i < argv.length; i++) {
		if (argv[i].startsWith('--') && i + 1 < argv.length) {
			args[argv[i].slice(2)] = argv[i + 1];
			i++;
		}
	}
	return args;
}

/** Formats a bigint as comma-separated string */
function formatBigint(n: bigint): string {
	return n.toLocaleString();
}

/** Prints a section header */
function header(title: string): void {
	console.log('');
	console.log('================================================================');
	console.log(`  ${title}`);
	console.log('================================================================');
}

/** Prints a sub-header */
function subheader(title: string): void {
	console.log('');
	console.log(`  --- ${title} ---`);
}

/** Prints a key-value pair */
function kv(key: string, value: string | number | bigint, indent = 2): void {
	const pad = ' '.repeat(indent);
	const formatted = typeof value === 'bigint' ? formatBigint(value) : String(value);
	console.log(`${pad}${key.padEnd(35)} ${formatted}`);
}

/** Prints match/mismatch status */
function status(expected: bigint, actual: bigint, label: string): void {
	const delta = actual - expected;
	if (delta === 0n) {
		console.log(`\n  ${label}: MATCH`);
	} else {
		const pct = expected !== 0n ? Number((delta * 10000n) / expected) / 100 : 0;
		console.log(`\n  ${label}: MISMATCH`);
		console.log(`    Delta: ${formatBigint(delta)} (${pct > 0 ? '+' : ''}${pct.toFixed(2)}%)`);
	}
}

/** Resolves unit, defaulting empty to 'sat' (matches backfill service) */
function resolveUnit(unit: string | null | undefined): string {
	return unit || 'sat';
}

/** Checks if a table exists in a SQLite database */
function tableExists(db: Database.Database, table_name: string): boolean {
	const row = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name = ?`).get(table_name) as
		| {name: string}
		| undefined;
	return row !== undefined;
}

/** Sums BigInt values from rows by unit */
function sumByUnit<T>(rows: T[], getUnit: (r: T) => string, getAmount: (r: T) => number | bigint): Map<string, bigint> {
	const result = new Map<string, bigint>();
	for (const row of rows) {
		const unit = resolveUnit(getUnit(row));
		const amount = BigInt(getAmount(row));
		result.set(unit, (result.get(unit) || 0n) + amount);
	}
	return result;
}

/** Counts rows by unit */
function countByUnit<T>(rows: T[], getUnit: (r: T) => string): Map<string, number> {
	const result = new Map<string, number>();
	for (const row of rows) {
		const unit = resolveUnit(getUnit(row));
		result.set(unit, (result.get(unit) || 0) + 1);
	}
	return result;
}

/** Gets a cached metric total for a given metric/unit from the unit_metrics array */
function getCachedTotal(cached: CachedData, metric: string, unit: string): bigint {
	const row = cached.unit_metrics.find((r) => r.metric === metric && r.unit === unit);
	return row ? BigInt(row.total) : 0n;
}

/** Gets a cached metric count for a given metric/unit from the unit_metrics array */
function getCachedCount(cached: CachedData, metric: string, unit: string): number {
	const row = cached.unit_metrics.find((r) => r.metric === metric && r.unit === unit);
	return row ? row.count : 0;
}

/** Gets a cached keyset metric total */
function getCachedKeysetTotal(cached: CachedData, metric: string, keyset_id: string): bigint {
	const row = cached.keyset_metrics.find((r) => r.metric === metric && r.keyset_id === keyset_id);
	return row ? BigInt(row.total) : 0n;
}

/** Collects all unique units from multiple maps */
function collectUnits(...maps: (Map<string, any>)[]): string[] {
	const units = new Set<string>();
	for (const map of maps) {
		for (const key of map.keys()) units.add(key);
	}
	return Array.from(units).sort();
}

/* ============================================================================
   Ground Truth Collection (CDK Database)
   ============================================================================ */

/** Collects all ground truth data from the CDK mint database */
function collectMintGroundTruth(mint_db: Database.Database): GroundTruth {
	console.log('  Reading CDK mint database...');

	const has_issued_table = tableExists(mint_db, 'mint_quote_issued');
	const has_payments_table = tableExists(mint_db, 'mint_quote_payments');

	const issued_time_expr = has_issued_table
		? `CASE
			WHEN EXISTS (SELECT 1 FROM mint_quote_issued i WHERE i.quote_id = mint_quote.id)
				THEN (SELECT MIN(timestamp) FROM mint_quote_issued i WHERE i.quote_id = mint_quote.id)
			WHEN amount_paid = 0 AND amount_issued = 0 THEN NULL
			WHEN amount_paid > amount_issued THEN NULL
			ELSE created_time
		END`
		: `CASE
			WHEN amount_paid = 0 AND amount_issued = 0 THEN NULL
			WHEN amount_paid > amount_issued THEN NULL
			ELSE created_time
		END`;

	const _paid_time_expr = has_payments_table
		? `CASE
			WHEN EXISTS (SELECT 1 FROM mint_quote_payments p WHERE p.quote_id = mint_quote.id)
				THEN (SELECT MIN(timestamp) FROM mint_quote_payments p WHERE p.quote_id = mint_quote.id)
			WHEN amount_paid = 0 THEN NULL
			WHEN amount_paid > amount_issued THEN created_time
			WHEN amount_paid = amount_issued THEN created_time
			ELSE NULL
		END`
		: `CASE
			WHEN amount_paid = 0 THEN NULL
			WHEN amount_paid > amount_issued THEN created_time
			WHEN amount_paid = amount_issued THEN created_time
			ELSE NULL
		END`;

	// Mint quotes
	const mint_quotes = mint_db
		.prepare(
			`SELECT
				id, amount, unit, created_time, amount_paid, amount_issued,
				CASE
					WHEN amount_paid = 0 AND amount_issued = 0 THEN 'UNPAID'
					WHEN amount_paid > amount_issued THEN 'PAID'
					ELSE 'ISSUED'
				END AS state,
				${issued_time_expr} AS issued_time
			FROM mint_quote`,
		)
		.all() as MintQuoteRow[];
	console.log(`    mint_quote: ${mint_quotes.length} total`);

	// Melt quotes
	const melt_quotes = mint_db.prepare(`SELECT id, unit, amount, state, created_time, paid_time FROM melt_quote`).all() as MeltQuoteRow[];
	console.log(`    melt_quote: ${melt_quotes.length} total`);

	// Swaps
	const swaps = mint_db
		.prepare(
			`SELECT
				co.operation_id,
				k.unit,
				co.total_redeemed AS amount,
				co.completed_at AS created_time,
				COALESCE(co.fee_collected, 0) AS fee
			FROM completed_operations co
			LEFT JOIN blind_signature bs ON bs.operation_id = co.operation_id
			LEFT JOIN keyset k ON k.id = bs.keyset_id
			WHERE co.operation_kind = 'swap'
			GROUP BY co.operation_id, k.unit`,
		)
		.all() as SwapRow[];
	console.log(`    completed_operations (swaps): ${swaps.length} total`);

	// Proofs (SPENT only)
	const proofs = mint_db
		.prepare(
			`SELECT p.amount, p.keyset_id, k.unit, p.state, p.created_time
			FROM proof p
			LEFT JOIN keyset k ON k.id = p.keyset_id
			WHERE p.state = 'SPENT'`,
		)
		.all() as ProofRow[];
	console.log(`    proof (SPENT): ${proofs.length} total`);

	// Promises (blind signatures)
	const promises = mint_db
		.prepare(
			`SELECT bs.amount, bs.keyset_id, k.unit, bs.created_time
			FROM blind_signature bs
			LEFT JOIN keyset k ON k.id = bs.keyset_id`,
		)
		.all() as PromiseRow[];
	console.log(`    blind_signature: ${promises.length} total`);

	// Keyset amounts (for balance reconstruction)
	const keyset_amounts = mint_db
		.prepare(
			`SELECT ka.keyset_id, k.unit, ka.total_issued, ka.total_redeemed
			FROM keyset_amounts ka
			LEFT JOIN keyset k ON k.id = ka.keyset_id`,
		)
		.all() as KeysetAmountRow[];
	console.log(`    keyset_amounts: ${keyset_amounts.length} keysets`);

	return {mint_quotes, melt_quotes, swaps, proofs, promises, keyset_amounts};
}

/* ============================================================================
   Cached Data Collection (Orchard Database)
   ============================================================================ */

/** Collects analytics data from Orchard's SQLite */
function collectCachedData(db: Database.Database): CachedData {
	console.log('  Reading Orchard analytics cache...');

	const unit_metrics = db
		.prepare(
			`SELECT metric, unit, SUM(CAST(amount AS INTEGER)) as total, SUM(count) as count
			FROM analytics_mint
			WHERE keyset_id = ''
			GROUP BY metric, unit`,
		)
		.all() as DbMetricRow[];

	const keyset_metrics = db
		.prepare(
			`SELECT metric, keyset_id, unit, SUM(CAST(amount AS INTEGER)) as total, SUM(count) as count
			FROM analytics_mint
			WHERE keyset_id != ''
			GROUP BY metric, keyset_id, unit`,
		)
		.all() as DbKeysetMetricRow[];

	const checkpoints = db.prepare(`SELECT * FROM analytics_checkpoint WHERE module = 'cashu_mint'`).all() as DbCheckpointRow[];

	const total_row = db.prepare(`SELECT COUNT(*) as count FROM analytics_mint`).get() as {count: number} | undefined;
	const total_records = total_row?.count || 0;

	console.log(`    analytics_mint: ${total_records} total records (${unit_metrics.length} unit-level aggregates, ${keyset_metrics.length} keyset-level aggregates)`);
	console.log(`    analytics_checkpoint: ${checkpoints.length} checkpoints`);

	return {unit_metrics, keyset_metrics, checkpoints, total_records};
}

/* ============================================================================
   Analysis Functions
   ============================================================================ */

/** Analyzes mint quote metrics */
function analyzeMintQuotes(gt: GroundTruth, cached: CachedData): Map<string, bigint> {
	header('1. MINT QUOTES ANALYSIS');

	const all_count = countByUnit(gt.mint_quotes, (q) => q.unit);
	const issued = gt.mint_quotes.filter((q) => q.state === 'ISSUED');
	const issued_amount = sumByUnit(issued, (q) => q.unit, (q) => q.amount_issued);
	const with_timing = issued.filter((q) => q.issued_time !== null && q.issued_time !== undefined);
	const completion_time = sumByUnit(
		with_timing,
		(q) => q.unit,
		(q) => Math.max(0, q.issued_time! - q.created_time),
	);

	const unpaid = gt.mint_quotes.filter((q) => q.state === 'UNPAID');
	const paid = gt.mint_quotes.filter((q) => q.state === 'PAID');
	kv('Total mint quotes:', gt.mint_quotes.length);
	kv('  UNPAID:', unpaid.length);
	kv('  PAID:', paid.length);
	kv('  ISSUED:', issued.length);

	const units = collectUnits(all_count, issued_amount);

	for (const unit of units) {
		subheader(`Unit: ${unit}`);

		const exp_count = all_count.get(unit) || 0;
		const cached_count = getCachedCount(cached, 'mints_created', unit);
		kv('Expected mints_created (count):', exp_count);
		kv('Cached mints_created (count):', cached_count);
		status(BigInt(exp_count), BigInt(cached_count), `mints_created [${unit}]`);

		const exp_amount = issued_amount.get(unit) || 0n;
		const cached_amount = getCachedTotal(cached, 'mints_amount', unit);
		kv('Expected mints_amount:', exp_amount);
		kv('Cached mints_amount:', cached_amount);
		status(exp_amount, cached_amount, `mints_amount [${unit}]`);

		const exp_time = completion_time.get(unit) || 0n;
		const cached_time = getCachedTotal(cached, 'mints_completion_time', unit);
		kv('Expected mints_completion_time:', exp_time);
		kv('Cached mints_completion_time:', cached_time);
		status(exp_time, cached_time, `mints_completion_time [${unit}]`);
	}

	return issued_amount;
}

/** Analyzes melt quote metrics */
function analyzeMeltQuotes(gt: GroundTruth, cached: CachedData): Map<string, bigint> {
	header('2. MELT QUOTES ANALYSIS');

	const all_count = countByUnit(gt.melt_quotes, (q) => q.unit);
	const paid = gt.melt_quotes.filter((q) => q.state === 'PAID');
	const paid_amount = sumByUnit(paid, (q) => q.unit, (q) => q.amount);
	const with_timing = paid.filter((q) => q.paid_time !== null && q.paid_time !== undefined);
	const completion_time = sumByUnit(
		with_timing,
		(q) => q.unit,
		(q) => Math.max(0, q.paid_time! - q.created_time),
	);

	const unpaid = gt.melt_quotes.filter((q) => q.state === 'UNPAID');
	const pending = gt.melt_quotes.filter((q) => q.state === 'PENDING');
	kv('Total melt quotes:', gt.melt_quotes.length);
	kv('  UNPAID:', unpaid.length);
	kv('  PENDING:', pending.length);
	kv('  PAID:', paid.length);

	const units = collectUnits(all_count, paid_amount);

	for (const unit of units) {
		subheader(`Unit: ${unit}`);

		const exp_count = all_count.get(unit) || 0;
		const cached_count = getCachedCount(cached, 'melts_created', unit);
		kv('Expected melts_created (count):', exp_count);
		kv('Cached melts_created (count):', cached_count);
		status(BigInt(exp_count), BigInt(cached_count), `melts_created [${unit}]`);

		const exp_amount = paid_amount.get(unit) || 0n;
		const cached_amount = getCachedTotal(cached, 'melts_amount', unit);
		kv('Expected melts_amount:', exp_amount);
		kv('Cached melts_amount:', cached_amount);
		status(exp_amount, cached_amount, `melts_amount [${unit}]`);

		const exp_time = completion_time.get(unit) || 0n;
		const cached_time = getCachedTotal(cached, 'melts_completion_time', unit);
		kv('Expected melts_completion_time:', exp_time);
		kv('Cached melts_completion_time:', cached_time);
		status(exp_time, cached_time, `melts_completion_time [${unit}]`);
	}

	return paid_amount;
}

/** Analyzes swap metrics */
function analyzeSwaps(gt: GroundTruth, cached: CachedData): void {
	header('3. SWAPS ANALYSIS');

	const swap_amount = sumByUnit(gt.swaps, (s) => s.unit, (s) => s.amount);
	const swap_fee = sumByUnit(gt.swaps, (s) => s.unit, (s) => s.fee);
	const swap_count = countByUnit(gt.swaps, (s) => s.unit);

	kv('Total swaps:', gt.swaps.length);

	const units = collectUnits(swap_amount, swap_fee);

	for (const unit of units) {
		subheader(`Unit: ${unit}`);

		kv('Swap count:', swap_count.get(unit) || 0);

		const exp_amount = swap_amount.get(unit) || 0n;
		const cached_amount = getCachedTotal(cached, 'swaps_amount', unit);
		kv('Expected swaps_amount:', exp_amount);
		kv('Cached swaps_amount:', cached_amount);
		status(exp_amount, cached_amount, `swaps_amount [${unit}]`);

		const exp_fee = swap_fee.get(unit) || 0n;
		const cached_fee = getCachedTotal(cached, 'swaps_fee', unit);
		kv('Expected swaps_fee:', exp_fee);
		kv('Cached swaps_fee:', cached_fee);
		status(exp_fee, cached_fee, `swaps_fee [${unit}]`);

		const cached_fees_amount = getCachedTotal(cached, 'fees_amount', unit);
		kv('Cached fees_amount:', cached_fees_amount);
		status(exp_fee, cached_fees_amount, `fees_amount [${unit}]`);
	}
}

/** Analyzes proof (redeemed) metrics */
function analyzeProofs(gt: GroundTruth, cached: CachedData): Map<string, bigint> {
	header('4. PROOFS (REDEEMED) ANALYSIS');

	const redeemed_amount = sumByUnit(gt.proofs, (p) => p.unit, (p) => p.amount);
	const redeemed_count = countByUnit(gt.proofs, (p) => p.unit);

	kv('Total spent proofs:', gt.proofs.length);

	const units = collectUnits(redeemed_amount);

	for (const unit of units) {
		subheader(`Unit: ${unit}`);

		kv('Proof count:', redeemed_count.get(unit) || 0);

		const exp_amount = redeemed_amount.get(unit) || 0n;
		const cached_amount = getCachedTotal(cached, 'redeemed_amount', unit);
		kv('Expected redeemed_amount:', exp_amount);
		kv('Cached redeemed_amount:', cached_amount);
		status(exp_amount, cached_amount, `redeemed_amount [${unit}]`);
	}

	return redeemed_amount;
}

/** Analyzes promise (issued) metrics */
function analyzePromises(gt: GroundTruth, cached: CachedData): Map<string, bigint> {
	header('5. PROMISES (ISSUED) ANALYSIS');

	const issued_amount = sumByUnit(gt.promises, (p) => p.unit, (p) => p.amount);
	const issued_count = countByUnit(gt.promises, (p) => p.unit);

	kv('Total blind signatures:', gt.promises.length);

	const units = collectUnits(issued_amount);

	for (const unit of units) {
		subheader(`Unit: ${unit}`);

		kv('Promise count:', issued_count.get(unit) || 0);

		const exp_amount = issued_amount.get(unit) || 0n;
		const cached_amount = getCachedTotal(cached, 'issued_amount', unit);
		kv('Expected issued_amount:', exp_amount);
		kv('Cached issued_amount:', cached_amount);
		status(exp_amount, cached_amount, `issued_amount [${unit}]`);
	}

	return issued_amount;
}

/** Analyzes keyset-level metrics */
function analyzeKeysets(gt: GroundTruth, cached: CachedData): void {
	header('6. KEYSET ANALYSIS');

	// Group proofs by keyset
	const keyset_redeemed = new Map<string, bigint>();
	for (const p of gt.proofs) {
		const key = p.keyset_id;
		keyset_redeemed.set(key, (keyset_redeemed.get(key) || 0n) + BigInt(p.amount));
	}

	// Group promises by keyset
	const keyset_issued = new Map<string, bigint>();
	for (const p of gt.promises) {
		const key = p.keyset_id;
		keyset_issued.set(key, (keyset_issued.get(key) || 0n) + BigInt(p.amount));
	}

	const all_keysets = new Set<string>([...keyset_redeemed.keys(), ...keyset_issued.keys()]);
	kv('Keysets with activity:', all_keysets.size);

	console.log('');
	console.log('  Keyset ID              | Exp Issued     | Cached Issued  | Exp Redeemed   | Cached Redeem  | Status');
	console.log('  ' + '-'.repeat(110));

	for (const keyset_id of Array.from(all_keysets).sort()) {
		const exp_issued = keyset_issued.get(keyset_id) || 0n;
		const exp_redeemed = keyset_redeemed.get(keyset_id) || 0n;
		const cached_issued = getCachedKeysetTotal(cached, 'keyset_issued', keyset_id);
		const cached_redeemed = getCachedKeysetTotal(cached, 'keyset_redeemed', keyset_id);

		const issued_match = exp_issued === cached_issued;
		const redeemed_match = exp_redeemed === cached_redeemed;
		const match_str = issued_match && redeemed_match ? 'MATCH' : 'MISMATCH !!';

		const ks_short = keyset_id.length > 22 ? keyset_id.slice(0, 20) + '..' : keyset_id;
		console.log(
			`  ${ks_short.padEnd(25)}| ${String(exp_issued).padStart(14)} | ${String(cached_issued).padStart(14)} | ${String(exp_redeemed).padStart(14)} | ${String(cached_redeemed).padStart(14)} | ${match_str}`,
		);
	}
}

/** Analyzes balance reconstruction: issued - redeemed from cache vs keyset_amounts */
function analyzeBalanceReconstruction(gt: GroundTruth, cached: CachedData, issued: Map<string, bigint>, redeemed: Map<string, bigint>): void {
	header('7. BALANCE RECONSTRUCTION');

	// CDK ground truth from keyset_amounts
	const cdk_balance_by_unit = new Map<string, bigint>();
	for (const ka of gt.keyset_amounts) {
		const unit = resolveUnit(ka.unit);
		const balance = BigInt(ka.total_issued) - BigInt(ka.total_redeemed);
		cdk_balance_by_unit.set(unit, (cdk_balance_by_unit.get(unit) || 0n) + balance);
	}

	// Reconstructed from ground truth promises/proofs
	const gt_balance_by_unit = new Map<string, bigint>();
	const all_units = collectUnits(issued, redeemed, cdk_balance_by_unit);
	for (const unit of all_units) {
		const i = issued.get(unit) || 0n;
		const r = redeemed.get(unit) || 0n;
		gt_balance_by_unit.set(unit, i - r);
	}

	// Reconstructed from cached data
	const cached_balance_by_unit = new Map<string, bigint>();
	for (const unit of all_units) {
		const i = getCachedTotal(cached, 'issued_amount', unit);
		const r = getCachedTotal(cached, 'redeemed_amount', unit);
		cached_balance_by_unit.set(unit, i - r);
	}

	for (const unit of all_units) {
		subheader(`Unit: ${unit}`);

		const cdk = cdk_balance_by_unit.get(unit) || 0n;
		const gt_bal = gt_balance_by_unit.get(unit) || 0n;
		const cached_bal = cached_balance_by_unit.get(unit) || 0n;

		kv('CDK keyset_amounts balance:', cdk);
		kv('Ground truth (issued - redeemed):', gt_bal);
		kv('Cached (issued - redeemed):', cached_bal);
		status(cdk, gt_bal, `GT vs CDK balance [${unit}]`);
		status(cdk, cached_bal, `Cached vs CDK balance [${unit}]`);
	}
}

/* ============================================================================
   Summary
   ============================================================================ */

function printSummary(gt: GroundTruth, cached: CachedData): void {
	header('SUMMARY');

	// Compute all expected metrics per unit
	const issued_quotes = gt.mint_quotes.filter((q) => q.state === 'ISSUED');
	const paid_melts = gt.melt_quotes.filter((q) => q.state === 'PAID');

	const expected: Map<string, Map<string, bigint>> = new Map();

	const setMetric = (metric: string, unit: string, value: bigint) => {
		if (!expected.has(metric)) expected.set(metric, new Map());
		expected.get(metric)!.set(unit, value);
	};

	// Aggregate expected values
	for (const [unit, val] of sumByUnit(issued_quotes, (q) => q.unit, (q) => q.amount_issued)) setMetric('mints_amount', unit, val);
	for (const [unit, val] of sumByUnit(paid_melts, (q) => q.unit, (q) => q.amount)) setMetric('melts_amount', unit, val);
	for (const [unit, val] of sumByUnit(gt.swaps, (s) => s.unit, (s) => s.amount)) setMetric('swaps_amount', unit, val);
	for (const [unit, val] of sumByUnit(gt.swaps, (s) => s.unit, (s) => s.fee)) {
		setMetric('swaps_fee', unit, val);
		setMetric('fees_amount', unit, val);
	}
	for (const [unit, val] of sumByUnit(gt.proofs, (p) => p.unit, (p) => p.amount)) setMetric('redeemed_amount', unit, val);
	for (const [unit, val] of sumByUnit(gt.promises, (p) => p.unit, (p) => p.amount)) setMetric('issued_amount', unit, val);

	// Collect all units
	const all_units = new Set<string>();
	for (const metric_map of expected.values()) {
		for (const unit of metric_map.keys()) all_units.add(unit);
	}
	for (const row of cached.unit_metrics) all_units.add(row.unit);

	const metrics = ['mints_amount', 'melts_amount', 'swaps_amount', 'swaps_fee', 'fees_amount', 'redeemed_amount', 'issued_amount'];

	for (const unit of Array.from(all_units).sort()) {
		subheader(`Unit: ${unit}`);
		console.log('');
		console.log('  Metric                      | Expected          | Cached            | Delta             | Status');
		console.log('  ' + '-'.repeat(100));

		for (const m of metrics) {
			const exp = expected.get(m)?.get(unit) || 0n;
			const cch = getCachedTotal(cached, m, unit);
			const delta = cch - exp;
			const match = delta === 0n ? 'MATCH' : 'MISMATCH !!';
			console.log(
				`  ${m.padEnd(30)}| ${String(exp).padStart(17)} | ${String(cch).padStart(17)} | ${String(delta).padStart(17)} | ${match}`,
			);
		}

		// Balance row
		const exp_balance = (expected.get('issued_amount')?.get(unit) || 0n) - (expected.get('redeemed_amount')?.get(unit) || 0n);
		const cached_balance = getCachedTotal(cached, 'issued_amount', unit) - getCachedTotal(cached, 'redeemed_amount', unit);
		const balance_delta = cached_balance - exp_balance;
		console.log('  ' + '─'.repeat(100));
		console.log(
			`  ${'BALANCE (issued - redeemed)'.padEnd(30)}| ${String(exp_balance).padStart(17)} | ${String(cached_balance).padStart(17)} | ${String(balance_delta).padStart(17)} | ${balance_delta === 0n ? 'MATCH' : 'MISMATCH !!'}`,
		);
	}
}

/* ============================================================================
   Main
   ============================================================================ */

function main() {
	console.log('================================================================');
	console.log('  MINT ANALYTICS DIAGNOSTIC REPORT');
	console.log('================================================================');
	console.log(`  Mint DB:    ${MINT_DB_PATH}`);
	console.log(`  Orchard DB: ${DB_PATH}`);
	console.log(`  Mint Type:  ${MINT_TYPE}`);
	console.log(`  Time:       ${new Date().toISOString()}`);

	if (MINT_TYPE !== 'cdk') {
		console.error(`\n  ERROR: Mint type '${MINT_TYPE}' is not yet supported. Only 'cdk' is implemented.\n`);
		process.exit(1);
	}

	const fs = require('fs');
	if (!fs.existsSync(MINT_DB_PATH)) {
		console.error(`\n  ERROR: Mint database not found: ${MINT_DB_PATH}`);
		console.error('  Provide --mint-db <path> or set MINT_DATABASE in .env\n');
		process.exit(1);
	}
	if (!fs.existsSync(DB_PATH)) {
		console.error(`\n  ERROR: Orchard database not found: ${DB_PATH}`);
		console.error('  Provide --db <path>\n');
		process.exit(1);
	}

	const mint_db = new Database(MINT_DB_PATH, {readonly: true});
	const orchard_db = new Database(DB_PATH, {readonly: true});

	try {
		// Collect data
		header('DATA COLLECTION');
		const ground_truth = collectMintGroundTruth(mint_db);
		const cached_data = collectCachedData(orchard_db);

		// Mint info
		header('MINT INFO');
		kv('Mint quotes:', ground_truth.mint_quotes.length);
		kv('Melt quotes:', ground_truth.melt_quotes.length);
		kv('Swaps:', ground_truth.swaps.length);
		kv('Proofs (SPENT):', ground_truth.proofs.length);
		kv('Promises:', ground_truth.promises.length);
		kv('Active keysets:', ground_truth.keyset_amounts.length);
		kv('Cached records:', cached_data.total_records);

		subheader('Checkpoints');
		for (const cp of cached_data.checkpoints) {
			kv(`${cp.data_type}:`, `page ${cp.last_index} (updated ${new Date(cp.updated_at * 1000).toISOString()})`);
		}

		subheader('Cached Metric Totals');
		for (const row of cached_data.unit_metrics) {
			const display = row.total !== '0' ? `${BigInt(row.total)} (${row.count} rows)` : `count=${row.count}`;
			kv(`${row.metric} [${row.unit}]:`, display);
		}

		// Run analyses
		analyzeMintQuotes(ground_truth, cached_data);
		analyzeMeltQuotes(ground_truth, cached_data);
		analyzeSwaps(ground_truth, cached_data);
		const redeemed = analyzeProofs(ground_truth, cached_data);
		const issued = analyzePromises(ground_truth, cached_data);
		analyzeKeysets(ground_truth, cached_data);
		analyzeBalanceReconstruction(ground_truth, cached_data, issued, redeemed);

		// Summary
		printSummary(ground_truth, cached_data);
	} finally {
		mint_db.close();
		orchard_db.close();
	}

	console.log('\n  Done.\n');
}

main();
