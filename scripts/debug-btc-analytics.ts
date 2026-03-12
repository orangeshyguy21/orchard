/**
 * Bitcoin Analytics Diagnostic Script
 *
 * Compares LND on-chain transaction ground truth against the analytics_bitcoin cache
 * to identify discrepancies. Validates wallet balance reconstruction from cached metrics.
 *
 * Usage:
 *   npm run debug:btc-analytics
 *   npm run debug:btc-analytics -- --container polar-n4-nicos_node --db data/orchard.db
 */

import {execSync} from 'child_process';
import Database from 'better-sqlite3';

/* ============================================================================
   Configuration
   ============================================================================ */

const ARGS = parseArgs(process.argv.slice(2));
const CONTAINER = ARGS.container || 'polar-n4-dave';
const NODE_PUBKEY = '02590d3671599a3f6ae7eb5a99107862a62c7eee0a4762dced9567024fbc28cffd';
const DB_PATH = ARGS.db || 'data/orchard.db';
const LNCLI_PREFIX = `docker exec ${CONTAINER} /opt/litd/lncli --tlscertpath /home/litd/.lnd/tls.cert --macaroonpath /home/litd/.lnd/data/chain/bitcoin/regtest/admin.macaroon --network regtest`;

/* ============================================================================
   Types
   ============================================================================ */

interface LndTransaction {
	tx_hash: string;
	amount: string;
	total_fees: string;
	time_stamp: string;
	num_confirmations: number;
	block_height: number;
	label: string;
}

interface LndWalletBalance {
	total_balance: string;
	confirmed_balance: string;
	unconfirmed_balance: string;
}

interface DbMetricRow {
	metric: string;
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

interface DbAnalyticsRow {
	metric: string;
	date: number;
	amount: string;
	count: number;
}

interface GroundTruth {
	transactions: LndTransaction[];
	wallet_balance: LndWalletBalance;
	node_pubkey: string;
	alias: string;
}

interface CachedData {
	metric_totals: DbMetricRow[];
	checkpoints: DbCheckpointRow[];
	records: DbAnalyticsRow[];
	total_records: number;
}

/* ============================================================================
   Helpers
   ============================================================================ */

/** Parses CLI arguments like --container foo --db bar */
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

/** Executes an lncli command and returns parsed JSON */
function lncli<T>(cmd: string): T {
	const full_cmd = `${LNCLI_PREFIX} ${cmd}`;
	const output = execSync(full_cmd, {maxBuffer: 100 * 1024 * 1024, encoding: 'utf8'});
	return JSON.parse(output) as T;
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
		console.log(`    Delta: ${formatBigint(delta)} sat (${pct > 0 ? '+' : ''}${pct.toFixed(2)}%)`);
	}
}

/** Gets a metric total from the metric_totals array */
function getCachedTotal(cached: CachedData, metric: string): bigint {
	const row = cached.metric_totals.find((r) => r.metric === metric);
	return row ? BigInt(row.total) : 0n;
}

/** Gets a metric count from the metric_totals array */
function getCachedCount(cached: CachedData, metric: string): number {
	const row = cached.metric_totals.find((r) => r.metric === metric);
	return row ? row.count : 0;
}

/* ============================================================================
   LND Data Collection
   ============================================================================ */

/** Collects ground truth from LND */
function collectLndData(): GroundTruth {
	console.log('  Fetching LND data via docker exec...');

	const info = lncli<{identity_pubkey: string; alias: string}>('getinfo');
	console.log(`    getinfo: ${info.alias} (${info.identity_pubkey.slice(0, 16)}...)`);

	const txns_resp = lncli<{transactions: LndTransaction[]}>('listchaintxns');
	const transactions = txns_resp.transactions || [];
	console.log(`    listchaintxns: ${transactions.length} on-chain transactions`);

	const wallet_resp = lncli<LndWalletBalance>('walletbalance');
	console.log(`    walletbalance: ${wallet_resp.confirmed_balance} sat confirmed, ${wallet_resp.unconfirmed_balance} sat unconfirmed`);

	return {
		transactions,
		wallet_balance: wallet_resp,
		node_pubkey: NODE_PUBKEY || info.identity_pubkey,
		alias: info.alias,
	};
}

/* ============================================================================
   DB Data Collection
   ============================================================================ */

/** Collects analytics data from Orchard's SQLite */
function collectCachedData(db: Database.Database, node_pubkey: string): CachedData {
	console.log('  Reading Orchard analytics cache...');

	const metric_totals = db
		.prepare(
			`SELECT metric, SUM(CAST(amount AS INTEGER)) as total, SUM(count) as count
			FROM analytics_bitcoin
			WHERE node_pubkey = ? AND group_key = '' AND unit = 'sat'
			GROUP BY metric`,
		)
		.all(node_pubkey) as DbMetricRow[];

	const checkpoints = db
		.prepare(`SELECT * FROM analytics_checkpoint WHERE module = 'bitcoin' AND scope = ?`)
		.all(node_pubkey) as DbCheckpointRow[];

	const records = db
		.prepare(
			`SELECT metric, date, amount, count
			FROM analytics_bitcoin
			WHERE node_pubkey = ? AND group_key = '' AND unit = 'sat'
			ORDER BY date`,
		)
		.all(node_pubkey) as DbAnalyticsRow[];

	const total_row = db.prepare(`SELECT COUNT(*) as count FROM analytics_bitcoin WHERE node_pubkey = ?`).get(node_pubkey) as
		| {count: number}
		| undefined;
	const total_records = total_row?.count || 0;

	console.log(`    analytics_bitcoin: ${total_records} total records (${records.length} BTC sat records)`);
	console.log(`    analytics_checkpoint: ${checkpoints.length} checkpoints`);

	return {metric_totals, checkpoints, records, total_records};
}

/* ============================================================================
   Analysis Functions
   ============================================================================ */

/** Analyzes payments_in (on-chain receives) */
function analyzePaymentsIn(gt: GroundTruth, cached: CachedData): bigint {
	header('1. PAYMENTS IN (On-Chain Receives)');

	const receives = gt.transactions.filter((tx) => BigInt(tx.amount || '0') > 0n);
	let expected_amount = 0n;
	for (const tx of receives) {
		expected_amount += BigInt(tx.amount);
	}

	kv('Total receive transactions:', receives.length);
	kv('Expected payments_in (sat):', expected_amount);
	kv('Cached payments_in (sat):', getCachedTotal(cached, 'payments_in'));
	kv('Cached payments_in (count):', getCachedCount(cached, 'payments_in'));

	status(expected_amount, getCachedTotal(cached, 'payments_in'), 'payments_in');

	return expected_amount;
}

/** Analyzes payments_out (on-chain sends) */
function analyzePaymentsOut(gt: GroundTruth, cached: CachedData): bigint {
	header('2. PAYMENTS OUT (On-Chain Sends)');

	// Sends have negative amounts in LND; analytics stores them as positive
	const sends = gt.transactions.filter((tx) => BigInt(tx.amount || '0') < 0n);
	let expected_amount = 0n;
	for (const tx of sends) {
		expected_amount += -BigInt(tx.amount); // Negate to get positive
	}

	kv('Total send transactions:', sends.length);
	kv('Expected payments_out (sat):', expected_amount);
	kv('Cached payments_out (sat):', getCachedTotal(cached, 'payments_out'));
	kv('Cached payments_out (count):', getCachedCount(cached, 'payments_out'));

	status(expected_amount, getCachedTotal(cached, 'payments_out'), 'payments_out');

	return expected_amount;
}

/** Analyzes fees (on-chain tx fees) */
function analyzeFees(gt: GroundTruth, cached: CachedData): bigint {
	header('3. FEES (On-Chain Transaction Fees)');

	// Only transactions with fees > 0
	const with_fees = gt.transactions.filter((tx) => BigInt(tx.total_fees || '0') > 0n);
	let expected_amount = 0n;
	for (const tx of with_fees) {
		expected_amount += BigInt(tx.total_fees);
	}

	kv('Transactions with fees:', with_fees.length);
	kv('Expected fees (sat):', expected_amount);
	kv('Cached fees (sat):', getCachedTotal(cached, 'fees'));
	kv('Cached fees (count):', getCachedCount(cached, 'fees'));

	status(expected_amount, getCachedTotal(cached, 'fees'), 'fees');

	return expected_amount;
}

/** Analyzes hourly bucket distribution */
function analyzeHourlyBuckets(cached: CachedData): void {
	header('4. HOURLY BUCKET DISTRIBUTION');

	const by_metric: Map<string, number> = new Map();
	for (const row of cached.records) {
		by_metric.set(row.metric, (by_metric.get(row.metric) || 0) + 1);
	}

	kv('Total hourly buckets:', cached.records.length);
	for (const [metric, count] of Array.from(by_metric).sort()) {
		kv(`  ${metric}:`, count);
	}

	// Show date range
	if (cached.records.length > 0) {
		const dates = cached.records.map((r) => r.date).sort((a, b) => a - b);
		const oldest = new Date(dates[0] * 1000).toISOString();
		const newest = new Date(dates[dates.length - 1] * 1000).toISOString();
		kv('Oldest bucket:', oldest);
		kv('Newest bucket:', newest);
	}
}

/** Reconstructs wallet balance and compares with LND walletbalance */
function analyzeBalanceReconstruction(
	gt: GroundTruth,
	cached: CachedData,
	expected: {payments_in: bigint; payments_out: bigint; fees: bigint},
): void {
	header('5. WALLET BALANCE RECONSTRUCTION');

	const actual_balance = BigInt(gt.wallet_balance.confirmed_balance);
	const actual_unconfirmed = BigInt(gt.wallet_balance.unconfirmed_balance);
	const actual_total = BigInt(gt.wallet_balance.total_balance);

	subheader('LND Wallet Balance');
	kv('Confirmed (sat):', actual_balance);
	kv('Unconfirmed (sat):', actual_unconfirmed);
	kv('Total (sat):', actual_total);

	// Ground truth reconstruction: net = in - out (LND amounts already include fees in the send amount)
	// Note: LND's `amount` for sends is negative and INCLUDES the fee.
	// But total_fees is reported separately. The backfill stores:
	//   payments_out = abs(amount)  (which includes fees)
	//   fees = total_fees           (the fee portion, separately)
	// So net from analytics = payments_in - payments_out
	// (fees are a subset of payments_out, not additional)
	const gt_net = expected.payments_in - expected.payments_out;

	subheader('Ground Truth Reconstruction');
	kv('+ payments_in (sat):', expected.payments_in);
	kv('- payments_out (sat):', expected.payments_out);
	console.log('  ' + '─'.repeat(50));
	kv('= Net change (sat):', gt_net);

	// Cached reconstruction
	const cached_in = getCachedTotal(cached, 'payments_in');
	const cached_out = getCachedTotal(cached, 'payments_out');
	const cached_net = cached_in - cached_out;

	subheader('Cached Reconstruction');
	kv('+ payments_in (sat):', cached_in);
	kv('- payments_out (sat):', cached_out);
	console.log('  ' + '─'.repeat(50));
	kv('= Net change (sat):', cached_net);

	subheader('Comparison');
	status(gt_net, cached_net, 'Cached net vs Ground truth net');

	// Note: we can't directly compare net with wallet balance because
	// wallet balance reflects the cumulative state including the initial
	// funding. But if analytics captured ALL transactions from genesis,
	// the net should equal the wallet balance.
	subheader('Net vs Wallet Balance');
	kv('Cached net (sat):', cached_net);
	kv('LND confirmed balance (sat):', actual_balance);
	kv('LND total balance (sat):', actual_total);

	const delta_confirmed = cached_net - actual_balance;
	const delta_total = cached_net - actual_total;
	if (delta_confirmed === 0n) {
		console.log('\n  Cached net vs Confirmed balance: MATCH');
	} else {
		console.log(`\n  Cached net vs Confirmed balance: DELTA ${formatBigint(delta_confirmed)} sat`);
		console.log('    (Expected if analytics missed early txs or has pending txs)');
	}
	if (delta_total === 0n) {
		console.log('  Cached net vs Total balance: MATCH');
	} else {
		console.log(`  Cached net vs Total balance: DELTA ${formatBigint(delta_total)} sat`);
	}
}

/* ============================================================================
   Summary
   ============================================================================ */

function printSummary(
	cached: CachedData,
	expected: {payments_in: bigint; payments_out: bigint; fees: bigint},
	wallet_balance: LndWalletBalance,
): void {
	header('SUMMARY');

	const metrics = ['payments_in', 'payments_out', 'fees'] as const;
	const expected_map: Record<string, bigint> = {
		payments_in: expected.payments_in,
		payments_out: expected.payments_out,
		fees: expected.fees,
	};

	console.log('');
	console.log('  Metric                      | Expected (sat)    | Cached (sat)      | Delta (sat)       | Status');
	console.log('  ' + '-'.repeat(105));

	for (const m of metrics) {
		const exp = expected_map[m];
		const cch = getCachedTotal(cached, m);
		const delta = cch - exp;
		const match = delta === 0n ? 'MATCH' : 'MISMATCH !!';
		console.log(
			`  ${m.padEnd(30)}| ${String(exp).padStart(17)} | ${String(cch).padStart(17)} | ${String(delta).padStart(17)} | ${match}`,
		);
	}

	// Balance reconstruction row
	const exp_net = expected.payments_in - expected.payments_out;
	const cached_net = getCachedTotal(cached, 'payments_in') - getCachedTotal(cached, 'payments_out');
	const net_delta = cached_net - exp_net;
	console.log('  ' + '─'.repeat(105));
	console.log(
		`  ${'NET (in - out)'.padEnd(30)}| ${String(exp_net).padStart(17)} | ${String(cached_net).padStart(17)} | ${String(net_delta).padStart(17)} | ${net_delta === 0n ? 'MATCH' : 'MISMATCH !!'}`,
	);

	// Wallet balance comparison
	const confirmed = BigInt(wallet_balance.confirmed_balance);
	const balance_delta = cached_net - confirmed;
	console.log(
		`  ${'LND confirmed balance'.padEnd(30)}| ${String(confirmed).padStart(17)} |                   | ${String(balance_delta).padStart(17)} | ${balance_delta === 0n ? 'MATCH' : 'INVESTIGATE'}`,
	);
}

/* ============================================================================
   Main
   ============================================================================ */

function main() {
	console.log('================================================================');
	console.log('  BITCOIN ON-CHAIN ANALYTICS DIAGNOSTIC REPORT');
	console.log('================================================================');
	console.log(`  Container: ${CONTAINER}`);
	console.log(`  Database:  ${DB_PATH}`);
	console.log(`  Time:      ${new Date().toISOString()}`);

	// Collect LND data
	header('DATA COLLECTION');
	const gt = collectLndData();

	// Collect DB data
	const db = new Database(DB_PATH, {readonly: true});
	const cached = collectCachedData(db, gt.node_pubkey);

	// Print node info
	header('NODE INFO');
	kv('Pubkey:', gt.node_pubkey);
	kv('Alias:', gt.alias);
	kv('On-chain transactions:', gt.transactions.length);
	kv('Wallet confirmed (sat):', gt.wallet_balance.confirmed_balance);
	kv('Wallet unconfirmed (sat):', gt.wallet_balance.unconfirmed_balance);
	kv('Wallet total (sat):', gt.wallet_balance.total_balance);

	subheader('Checkpoints');
	for (const cp of cached.checkpoints) {
		kv(`${cp.data_type}:`, `ts=${cp.last_index} (${new Date(cp.updated_at * 1000).toISOString()})`);
	}

	subheader('Cached Metric Totals');
	for (const row of cached.metric_totals) {
		kv(`${row.metric} (${row.count} rows):`, `${BigInt(row.total)} sat`);
	}

	// Run analyses
	const payments_in = analyzePaymentsIn(gt, cached);
	const payments_out = analyzePaymentsOut(gt, cached);
	const fees = analyzeFees(gt, cached);
	analyzeHourlyBuckets(cached);
	analyzeBalanceReconstruction(gt, cached, {payments_in, payments_out, fees});

	// Summary
	printSummary(cached, {payments_in, payments_out, fees}, gt.wallet_balance);

	db.close();
	console.log('\n  Done.\n');
}

main();
