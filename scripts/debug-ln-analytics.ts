/**
 * Lightning Analytics Diagnostic Script
 *
 * Compares LND ground truth against the analytics_lightning cache
 * to identify discrepancies in the balance sheet reconstruction.
 *
 * Usage:
 *   npm run debug:ln-analytics
 *   npm run debug:ln-analytics -- --container polar-n4-nicos_node --db data/orchard.db
 */

import {execSync} from 'child_process';
import Database from 'better-sqlite3';

/* ============================================================================
   Configuration
   ============================================================================ */

const ARGS = parseArgs(process.argv.slice(2));
const CONTAINER = ARGS.container || 'polar-n4-nicos_node';
const DB_PATH = ARGS.db || 'data/orchard.db';
const LNCLI_PREFIX = `docker exec ${CONTAINER} lncli --tlscertpath /home/lnd/.lnd/tls.cert --macaroonpath /home/lnd/.lnd/data/chain/bitcoin/regtest/admin.macaroon --network regtest`;

/* ============================================================================
   Types
   ============================================================================ */

interface LndChannel {
    channel_point: string;
    chan_id: string;
    capacity: string;
    local_balance: string;
    remote_balance: string;
    initiator: boolean;
    push_amount_sat: string;
    private: boolean;
    active: boolean;
}

interface LndClosedChannel {
    channel_point: string;
    chan_id: string;
    capacity: string;
    close_height: number;
    settled_balance: string;
    time_locked_balance: string;
    close_type: string;
    open_initiator: string;
    closing_tx_hash: string;
}

interface LndPayment {
    payment_hash: string;
    value_msat: string;
    fee_msat: string;
    status: string;
    creation_time_ns: string;
    payment_index: string;
}

interface LndInvoice {
    value_msat: string;
    amt_paid_msat: string;
    state: string;
    creation_date: string;
    settle_date: string;
    add_index: string;
}

interface LndForward {
    timestamp_ns: string;
    fee_msat: string;
    amt_in_msat: string;
    amt_out_msat: string;
}

interface LndTransaction {
    tx_hash: string;
    time_stamp: string;
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
    group_key: string;
    unit: string;
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

/** Formats a bigint msat value as human-readable sat string */
function formatMsat(msat: bigint): string {
    const sat = msat / 1000n;
    const remainder = msat % 1000n;
    if (remainder === 0n) {
        return `${sat.toLocaleString()} sat`;
    }
    return `${sat.toLocaleString()}.${remainder.toString().padStart(3, '0')} sat`;
}

/** Formats a bigint as comma-separated string */
function formatBigint(n: bigint): string {
    return n.toLocaleString();
}

/** Extracts funding txid from channel_point (txid:index) */
function extractFundingTxid(channel_point: string): string {
    return channel_point.split(':')[0] || '';
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
    console.log(`${pad}${key.padEnd(30)} ${formatted}`);
}

/** Prints match/mismatch status */
function status(expected: bigint, actual: bigint, label: string): void {
    const delta = actual - expected;
    if (delta === 0n) {
        console.log(`\n  ${label}: MATCH`);
    } else {
        const pct = expected !== 0n ? Number((delta * 10000n) / expected) / 100 : 0;
        console.log(`\n  ${label}: MISMATCH`);
        console.log(`    Delta: ${formatMsat(delta)} (${pct > 0 ? '+' : ''}${pct.toFixed(2)}%)`);
    }
}

/* ============================================================================
   LND Data Collection
   ============================================================================ */

/** Collects all ground truth data from LND */
function collectLndData() {
    console.log('  Fetching LND data via docker exec...');

    const info = lncli<{identity_pubkey: string; alias: string; num_active_channels: number}>('getinfo');
    console.log(`    getinfo: ${info.alias} (${info.identity_pubkey.slice(0, 16)}...)`);

    const channels_resp = lncli<{channels: LndChannel[]}>('listchannels');
    const channels = channels_resp.channels || [];
    console.log(`    listchannels: ${channels.length} open channels`);

    const closed_resp = lncli<{channels: LndClosedChannel[]}>('closedchannels');
    const closed_channels = closed_resp.channels || [];
    console.log(`    closedchannels: ${closed_channels.length} closed channels`);

    const payments_resp = lncli<{payments: LndPayment[]}>('listpayments --include_incomplete --max_payments 99999');
    const payments = payments_resp.payments || [];
    console.log(`    listpayments: ${payments.length} total payments`);

    const invoices_resp = lncli<{invoices: LndInvoice[]}>('listinvoices --max_invoices 99999');
    const invoices = invoices_resp.invoices || [];
    console.log(`    listinvoices: ${invoices.length} total invoices`);

    const forwards_resp = lncli<{forwarding_events: LndForward[]; last_offset_index: number}>('fwdinghistory --max_events 99999');
    const forwards = forwards_resp.forwarding_events || [];
    console.log(`    fwdinghistory: ${forwards.length} total forwards`);

    const txns_resp = lncli<{transactions: LndTransaction[]}>('listchaintxns');
    const transactions = txns_resp.transactions || [];
    console.log(`    listchaintxns: ${transactions.length} on-chain transactions`);

    return {info, channels, closed_channels, payments, invoices, forwards, transactions};
}

/* ============================================================================
   DB Data Collection
   ============================================================================ */

/** Collects analytics data from SQLite */
function collectDbData(db: Database.Database, node_pubkey: string) {
    console.log('  Reading analytics database...');

    const metric_totals = db
        .prepare(
            `SELECT metric, SUM(CAST(amount AS INTEGER)) as total, COUNT(*) as count
             FROM analytics_lightning
             WHERE node_pubkey = ? AND unit = 'msat' AND group_key = ''
             GROUP BY metric`,
        )
        .all(node_pubkey) as DbMetricRow[];

    const checkpoints = db
        .prepare(`SELECT * FROM analytics_checkpoint WHERE module = 'lightning'`)
        .all() as DbCheckpointRow[];

    const all_records = db
        .prepare(
            `SELECT metric, date, amount, group_key, unit
             FROM analytics_lightning
             WHERE node_pubkey = ? AND unit = 'msat' AND group_key = ''
             ORDER BY date`,
        )
        .all(node_pubkey) as DbAnalyticsRow[];

    const total_records = db
        .prepare(`SELECT COUNT(*) as count FROM analytics_lightning WHERE node_pubkey = ?`)
        .get(node_pubkey) as {count: number} | undefined;

    console.log(`    analytics_lightning: ${total_records?.count || 0} total records (${all_records.length} BTC msat records)`);
    console.log(`    analytics_checkpoint: ${checkpoints.length} checkpoints`);

    return {metric_totals, checkpoints, all_records};
}

/* ============================================================================
   Analysis Functions
   ============================================================================ */

/** Reproduces computeInitialLocalBalance from the backfill service */
function computeInitialLocalBalance(
    channel: LndChannel | LndClosedChannel,
    is_open: boolean,
): {amount_msat: bigint; method: string} {
    const capacity_msat = BigInt(channel.capacity) * 1000n;

    if (is_open) {
        const open_ch = channel as LndChannel;
        if (open_ch.initiator !== undefined && open_ch.initiator !== null) {
            const push_msat = open_ch.push_amount_sat ? BigInt(open_ch.push_amount_sat) * 1000n : 0n;
            if (open_ch.initiator) {
                return {amount_msat: capacity_msat - push_msat, method: 'initiator=true: capacity - push'};
            } else {
                return {amount_msat: push_msat, method: 'initiator=false: push_amount'};
            }
        }
        // Fallback to current local_balance
        return {amount_msat: BigInt(open_ch.local_balance) * 1000n, method: 'FALLBACK: current local_balance'};
    }

    // Closed channel
    const closed_ch = channel as LndClosedChannel;
    if (closed_ch.open_initiator === 'INITIATOR_LOCAL') {
        return {amount_msat: capacity_msat, method: 'open_initiator=LOCAL: full capacity'};
    }
    if (closed_ch.open_initiator === 'INITIATOR_REMOTE') {
        return {amount_msat: 0n, method: 'open_initiator=REMOTE: 0'};
    }
    if (closed_ch.open_initiator === 'INITIATOR_BOTH') {
        // Falls through to fallback in the service
        return {amount_msat: BigInt(closed_ch.settled_balance) * 1000n, method: 'FALLBACK (BOTH): settled_balance'};
    }
    // UNKNOWN or other
    return {amount_msat: BigInt(closed_ch.settled_balance) * 1000n, method: 'FALLBACK (UNKNOWN): settled_balance'};
}

/** Computes initial remote balance (capacity - local) */
function computeInitialRemoteBalance(
    channel: LndChannel | LndClosedChannel,
    is_open: boolean,
): bigint {
    const capacity_msat = BigInt(channel.capacity) * 1000n;
    const {amount_msat: local_msat} = computeInitialLocalBalance(channel, is_open);
    return capacity_msat - local_msat;
}

/** Analyzes channel opens (local + remote) */
function analyzeChannelOpens(
    channels: LndChannel[],
    closed_channels: LndClosedChannel[],
    tx_map: Map<string, number>,
    db_local_total: bigint,
    db_remote_total: bigint,
) {
    header('1. CHANNEL OPENS ANALYSIS');

    const warnings: string[] = [];
    let expected_local = 0n;
    let expected_remote = 0n;

    console.log('');
    console.log('  Channel Point             | Capacity (sat) | Initiator | Init Local (sat)   | Init Remote (sat)  | TX Found');
    console.log('  ' + '-'.repeat(130));

    // Open channels
    for (const ch of channels) {
        const txid = extractFundingTxid(ch.channel_point);
        const tx_found = tx_map.has(txid);
        const {amount_msat: local_msat, method} = computeInitialLocalBalance(ch, true);
        const remote_msat = computeInitialRemoteBalance(ch, true);
        const local_sat = local_msat / 1000n;
        const remote_sat = remote_msat / 1000n;

        if (tx_found) {
            expected_local += local_msat;
            expected_remote += remote_msat;
        }

        const tx_str = tx_found ? 'YES' : 'NO !!';
        const cp_short = ch.channel_point.slice(0, 12) + '..';
        console.log(
            `  ${(cp_short + ' (open)').padEnd(28)}| ${ch.capacity.padStart(14)} | ${String(ch.initiator).padEnd(9)} | ${String(local_sat).padStart(18)} | ${String(remote_sat).padStart(18)} | ${tx_str}`,
        );

        if (!tx_found) {
            warnings.push(`Channel ${ch.channel_point} (open) SKIPPED - no tx timestamp for ${txid.slice(0, 16)}...`);
        }
    }

    // Closed channels
    for (const ch of closed_channels) {
        const txid = extractFundingTxid(ch.channel_point);
        const tx_found = tx_map.has(txid);
        const {amount_msat: local_msat} = computeInitialLocalBalance(ch, false);
        const remote_msat = computeInitialRemoteBalance(ch, false);
        const local_sat = local_msat / 1000n;
        const remote_sat = remote_msat / 1000n;

        if (tx_found) {
            expected_local += local_msat;
            expected_remote += remote_msat;
        }

        const tx_str = tx_found ? 'YES' : 'NO !!';
        const cp_short = ch.channel_point.slice(0, 12) + '..';
        console.log(
            `  ${(cp_short + ' (closed)').padEnd(28)}| ${ch.capacity.padStart(14)} | ${(ch.open_initiator || '?').padEnd(9)} | ${String(local_sat).padStart(18)} | ${String(remote_sat).padStart(18)} | ${tx_str}`,
        );

        if (!tx_found) {
            warnings.push(`Channel ${ch.channel_point} (closed) SKIPPED - no tx timestamp for ${txid.slice(0, 16)}...`);
        }
    }

    subheader('Local Totals');
    kv('Expected channel_opens (msat):', expected_local);
    kv('Expected channel_opens (sat):', expected_local / 1000n);
    kv('DB channel_opens (msat):', db_local_total);
    kv('DB channel_opens (sat):', db_local_total / 1000n);
    status(expected_local, db_local_total, 'channel_opens');

    subheader('Remote Totals');
    kv('Expected channel_opens_remote (msat):', expected_remote);
    kv('Expected channel_opens_remote (sat):', expected_remote / 1000n);
    kv('DB channel_opens_remote (msat):', db_remote_total);
    kv('DB channel_opens_remote (sat):', db_remote_total / 1000n);
    status(expected_remote, db_remote_total, 'channel_opens_remote');

    if (warnings.length > 0) {
        subheader('Warnings');
        for (const w of warnings) {
            console.log(`  !! ${w}`);
        }
    }

    return {local: expected_local, remote: expected_remote};
}

/** Analyzes payments out */
function analyzePayments(payments: LndPayment[], db_total: bigint, checkpoint_offset: number) {
    header('2. PAYMENTS OUT ANALYSIS');

    const succeeded = payments.filter((p) => p.status === 'SUCCEEDED');
    const pending = payments.filter((p) => p.status === 'IN_FLIGHT' || p.status === 'INITIATED');
    const failed = payments.filter((p) => p.status === 'FAILED');

    let expected_total = 0n;
    for (const p of succeeded) {
        expected_total += BigInt(p.value_msat || '0') + BigInt(p.fee_msat || '0');
    }

    kv('Total payments from LND:', payments.length);
    kv('  Succeeded:', succeeded.length);
    kv('  Pending/In-flight:', pending.length);
    kv('  Failed:', failed.length);
    kv('', '');
    kv('Succeeded value (msat):', succeeded.reduce((s, p) => s + BigInt(p.value_msat || '0'), 0n));
    kv('Succeeded fees (msat):', succeeded.reduce((s, p) => s + BigInt(p.fee_msat || '0'), 0n));
    kv('Expected payments_out (msat):', expected_total);
    kv('Expected payments_out (sat):', expected_total / 1000n);
    kv('DB payments_out (msat):', db_total);
    kv('DB payments_out (sat):', db_total / 1000n);
    kv('Checkpoint offset:', checkpoint_offset);

    status(expected_total, db_total, 'payments_out');

    return expected_total;
}

/** Analyzes invoices in */
function analyzeInvoices(invoices: LndInvoice[], db_total: bigint, checkpoint_offset: number) {
    header('3. INVOICES IN ANALYSIS');

    const settled = invoices.filter((i) => i.state === 'SETTLED');
    const open = invoices.filter((i) => i.state === 'OPEN');
    const canceled = invoices.filter((i) => i.state === 'CANCELED');
    const accepted = invoices.filter((i) => i.state === 'ACCEPTED');

    let expected_total = 0n;
    for (const i of settled) {
        expected_total += BigInt(i.amt_paid_msat || '0');
    }

    kv('Total invoices from LND:', invoices.length);
    kv('  Settled:', settled.length);
    kv('  Open:', open.length);
    kv('  Canceled:', canceled.length);
    kv('  Accepted:', accepted.length);
    kv('', '');
    kv('Settled amt_paid (msat):', expected_total);
    kv('Expected invoices_in (sat):', expected_total / 1000n);
    kv('DB invoices_in (msat):', db_total);
    kv('DB invoices_in (sat):', db_total / 1000n);
    kv('Checkpoint offset:', checkpoint_offset);

    status(expected_total, db_total, 'invoices_in');

    return expected_total;
}

/** Analyzes forwards */
function analyzeForwards(forwards: LndForward[], db_total: bigint, checkpoint_offset: number) {
    header('4. FORWARD FEES ANALYSIS');

    let expected_total = 0n;
    for (const f of forwards) {
        expected_total += BigInt(f.fee_msat || '0');
    }

    kv('Total forwards from LND:', forwards.length);
    kv('Total fee (msat):', expected_total);
    kv('Expected forward_fees (sat):', expected_total / 1000n);
    kv('DB forward_fees (msat):', db_total);
    kv('DB forward_fees (sat):', db_total / 1000n);
    kv('Checkpoint offset:', checkpoint_offset);

    status(expected_total, db_total, 'forward_fees');

    return expected_total;
}

/** Analyzes channel closes (local + remote) */
function analyzeChannelCloses(
    closed_channels: LndClosedChannel[],
    tx_map: Map<string, number>,
    db_local_total: bigint,
    db_remote_total: bigint,
) {
    header('5. CHANNEL CLOSES ANALYSIS');

    let expected_local = 0n;
    let expected_remote = 0n;
    const warnings: string[] = [];

    for (const ch of closed_channels) {
        const closing_txid = ch.closing_tx_hash || '';
        const tx_found = closing_txid ? tx_map.has(closing_txid) : false;
        const settled_msat = BigInt(ch.settled_balance || '0') * 1000n;
        const capacity_msat = BigInt(ch.capacity || '0') * 1000n;
        const remote_msat = capacity_msat - settled_msat;

        if (tx_found) {
            if (settled_msat > 0n) expected_local += settled_msat;
            if (remote_msat > 0n) expected_remote += remote_msat;
        }

        if (!tx_found && closing_txid) {
            warnings.push(`Closed channel ${ch.channel_point} - no tx timestamp for closing tx ${closing_txid.slice(0, 16)}...`);
        }
    }

    kv('Closed channels:', closed_channels.length);

    subheader('Local');
    kv('Expected channel_closes (msat):', expected_local);
    kv('Expected channel_closes (sat):', expected_local / 1000n);
    kv('DB channel_closes (msat):', db_local_total);
    kv('DB channel_closes (sat):', db_local_total / 1000n);
    status(expected_local, db_local_total, 'channel_closes');

    subheader('Remote');
    kv('Expected channel_closes_remote (msat):', expected_remote);
    kv('Expected channel_closes_remote (sat):', expected_remote / 1000n);
    kv('DB channel_closes_remote (msat):', db_remote_total);
    kv('DB channel_closes_remote (sat):', db_remote_total / 1000n);
    status(expected_remote, db_remote_total, 'channel_closes_remote');

    if (warnings.length > 0) {
        subheader('Warnings');
        for (const w of warnings) {
            console.log(`  !! ${w}`);
        }
    }

    return {local: expected_local, remote: expected_remote};
}

/** Reconstructs balance and compares with LND actual (local + remote) */
function analyzeBalanceReconstruction(
    channels: LndChannel[],
    db_metrics: Map<string, bigint>,
    expected_metrics: Map<string, bigint>,
) {
    header('6. LOCAL BALANCE RECONSTRUCTION');

    const db_opens = db_metrics.get('channel_opens') || 0n;
    const db_invoices = db_metrics.get('invoices_in') || 0n;
    const db_forwards = db_metrics.get('forward_fees') || 0n;
    const db_payments = db_metrics.get('payments_out') || 0n;
    const db_closes = db_metrics.get('channel_closes') || 0n;
    const db_reconstructed = db_opens + db_invoices + db_forwards - db_payments - db_closes;

    subheader('From DB metrics');
    kv('+ channel_opens (msat):', db_opens);
    kv('+ invoices_in (msat):', db_invoices);
    kv('+ forward_fees (msat):', db_forwards);
    kv('- payments_out (msat):', db_payments);
    kv('- channel_closes (msat):', db_closes);
    console.log('  ' + '─'.repeat(50));
    kv('= Reconstructed (msat):', db_reconstructed);
    kv('= Reconstructed (sat):', db_reconstructed / 1000n);

    const exp_opens = expected_metrics.get('channel_opens') || 0n;
    const exp_invoices = expected_metrics.get('invoices_in') || 0n;
    const exp_forwards = expected_metrics.get('forward_fees') || 0n;
    const exp_payments = expected_metrics.get('payments_out') || 0n;
    const exp_closes = expected_metrics.get('channel_closes') || 0n;
    const exp_reconstructed = exp_opens + exp_invoices + exp_forwards - exp_payments - exp_closes;

    subheader('From LND ground truth');
    kv('+ channel_opens (msat):', exp_opens);
    kv('+ invoices_in (msat):', exp_invoices);
    kv('+ forward_fees (msat):', exp_forwards);
    kv('- payments_out (msat):', exp_payments);
    kv('- channel_closes (msat):', exp_closes);
    console.log('  ' + '─'.repeat(50));
    kv('= Expected (msat):', exp_reconstructed);
    kv('= Expected (sat):', exp_reconstructed / 1000n);

    subheader('Actual LND Local Balance');
    let actual_local_msat = 0n;
    for (const ch of channels) {
        actual_local_msat += BigInt(ch.local_balance) * 1000n;
    }
    kv('Sum local_balance (sat):', actual_local_msat / 1000n);
    kv('Sum local_balance (msat):', actual_local_msat);
    kv('Total capacity (sat):', channels.reduce((s, c) => s + BigInt(c.capacity), 0n));

    subheader('Local Comparison');
    const db_delta = db_reconstructed - actual_local_msat;
    const exp_delta = exp_reconstructed - actual_local_msat;
    kv('DB reconstructed vs actual:', `${formatMsat(db_delta)} (${actual_local_msat !== 0n ? ((Number(db_delta) / Number(actual_local_msat)) * 100).toFixed(2) : 0}%)`);
    kv('Expected vs actual:', `${formatMsat(exp_delta)} (${actual_local_msat !== 0n ? ((Number(exp_delta) / Number(actual_local_msat)) * 100).toFixed(2) : 0}%)`);

    // Remote balance reconstruction
    header('7. REMOTE BALANCE RECONSTRUCTION');

    const db_opens_r = db_metrics.get('channel_opens_remote') || 0n;
    const db_closes_r = db_metrics.get('channel_closes_remote') || 0n;
    const db_remote = db_opens_r + db_payments - db_invoices - db_forwards - db_closes_r;

    subheader('From DB metrics');
    kv('+ channel_opens_remote (msat):', db_opens_r);
    kv('+ payments_out (msat):', db_payments);
    kv('- invoices_in (msat):', db_invoices);
    kv('- forward_fees (msat):', db_forwards);
    kv('- channel_closes_remote (msat):', db_closes_r);
    console.log('  ' + '─'.repeat(50));
    kv('= Reconstructed (msat):', db_remote);
    kv('= Reconstructed (sat):', db_remote / 1000n);

    const exp_opens_r = expected_metrics.get('channel_opens_remote') || 0n;
    const exp_closes_r = expected_metrics.get('channel_closes_remote') || 0n;
    const exp_remote = exp_opens_r + exp_payments - exp_invoices - exp_forwards - exp_closes_r;

    subheader('From LND ground truth');
    kv('+ channel_opens_remote (msat):', exp_opens_r);
    kv('+ payments_out (msat):', exp_payments);
    kv('- invoices_in (msat):', exp_invoices);
    kv('- forward_fees (msat):', exp_forwards);
    kv('- channel_closes_remote (msat):', exp_closes_r);
    console.log('  ' + '─'.repeat(50));
    kv('= Expected (msat):', exp_remote);
    kv('= Expected (sat):', exp_remote / 1000n);

    subheader('Actual LND Remote Balance');
    let actual_remote_msat = 0n;
    for (const ch of channels) {
        actual_remote_msat += BigInt(ch.remote_balance) * 1000n;
    }
    kv('Sum remote_balance (sat):', actual_remote_msat / 1000n);
    kv('Sum remote_balance (msat):', actual_remote_msat);

    subheader('Remote Comparison');
    const db_remote_delta = db_remote - actual_remote_msat;
    const exp_remote_delta = exp_remote - actual_remote_msat;
    kv('DB reconstructed vs actual:', `${formatMsat(db_remote_delta)} (${actual_remote_msat !== 0n ? ((Number(db_remote_delta) / Number(actual_remote_msat)) * 100).toFixed(2) : 0}%)`);
    kv('Expected vs actual:', `${formatMsat(exp_remote_delta)} (${actual_remote_msat !== 0n ? ((Number(exp_remote_delta) / Number(actual_remote_msat)) * 100).toFixed(2) : 0}%)`);

    // Capacity cross-check
    subheader('Capacity Cross-Check');
    const total_capacity_msat = channels.reduce((s, c) => s + BigInt(c.capacity), 0n) * 1000n;
    kv('Local + Remote (DB):', `${formatMsat(db_reconstructed + db_remote)}`);
    kv('Local + Remote (Expected):', `${formatMsat(exp_reconstructed + exp_remote)}`);
    kv('Local + Remote (Actual):', `${formatMsat(actual_local_msat + actual_remote_msat)}`);
    kv('Total capacity (open ch):', `${formatMsat(total_capacity_msat)}`);

    return {db_reconstructed, exp_reconstructed, actual_local_msat, db_remote, exp_remote, actual_remote_msat};
}

/* ============================================================================
   Summary
   ============================================================================ */

function printSummary(
    expected_metrics: Map<string, bigint>,
    db_metrics: Map<string, bigint>,
    recon: {
        db_reconstructed: bigint;
        exp_reconstructed: bigint;
        actual_local_msat: bigint;
        db_remote: bigint;
        exp_remote: bigint;
        actual_remote_msat: bigint;
    },
) {
    header('SUMMARY');

    const metrics = [
        'channel_opens', 'channel_opens_remote',
        'payments_out', 'invoices_in', 'forward_fees',
        'channel_closes', 'channel_closes_remote',
    ];

    console.log('');
    console.log('  Metric                 | Expected (sat)    | DB Cached (sat)   | Delta (sat)       | Status');
    console.log('  ' + '-'.repeat(105));

    for (const m of metrics) {
        const exp = (expected_metrics.get(m) || 0n) / 1000n;
        const db = (db_metrics.get(m) || 0n) / 1000n;
        const delta = db - exp;
        const match = delta === 0n ? 'MATCH' : 'MISMATCH !!';
        console.log(
            `  ${m.padEnd(25)}| ${String(exp).padStart(17)} | ${String(db).padStart(17)} | ${String(delta).padStart(17)} | ${match}`,
        );
    }

    console.log('  ' + '─'.repeat(105));

    // Local reconstruction
    const exp_local_sat = recon.exp_reconstructed / 1000n;
    const db_local_sat = recon.db_reconstructed / 1000n;
    const actual_local_sat = recon.actual_local_msat / 1000n;
    const local_recon_delta = db_local_sat - exp_local_sat;
    console.log(
        `  ${'Local Reconstructed'.padEnd(25)}| ${String(exp_local_sat).padStart(17)} | ${String(db_local_sat).padStart(17)} | ${String(local_recon_delta).padStart(17)} | ${local_recon_delta === 0n ? 'MATCH' : 'MISMATCH !!'}`,
    );
    console.log(
        `  ${'Actual LND local'.padEnd(25)}| ${String(actual_local_sat).padStart(17)} |                   |                   |`,
    );
    const local_final = db_local_sat - actual_local_sat;
    console.log(
        `  ${'DB local vs Actual'.padEnd(25)}|                   |                   | ${String(local_final).padStart(17)} | ${Math.abs(Number(local_final)) < 100 ? 'CLOSE' : 'INVESTIGATE'}`,
    );

    // Remote reconstruction
    console.log('  ' + '─'.repeat(105));
    const exp_remote_sat = recon.exp_remote / 1000n;
    const db_remote_sat = recon.db_remote / 1000n;
    const actual_remote_sat = recon.actual_remote_msat / 1000n;
    const remote_recon_delta = db_remote_sat - exp_remote_sat;
    console.log(
        `  ${'Remote Reconstructed'.padEnd(25)}| ${String(exp_remote_sat).padStart(17)} | ${String(db_remote_sat).padStart(17)} | ${String(remote_recon_delta).padStart(17)} | ${remote_recon_delta === 0n ? 'MATCH' : 'MISMATCH !!'}`,
    );
    console.log(
        `  ${'Actual LND remote'.padEnd(25)}| ${String(actual_remote_sat).padStart(17)} |                   |                   |`,
    );
    const remote_final = db_remote_sat - actual_remote_sat;
    console.log(
        `  ${'DB remote vs Actual'.padEnd(25)}|                   |                   | ${String(remote_final).padStart(17)} | ${Math.abs(Number(remote_final)) < 100 ? 'CLOSE' : 'INVESTIGATE'}`,
    );
}

/* ============================================================================
   Main
   ============================================================================ */

function main() {
    console.log('================================================================');
    console.log('  LIGHTNING ANALYTICS DIAGNOSTIC REPORT');
    console.log('================================================================');
    console.log(`  Container: ${CONTAINER}`);
    console.log(`  Database:  ${DB_PATH}`);
    console.log(`  Time:      ${new Date().toISOString()}`);

    // Collect LND data
    header('DATA COLLECTION');
    const lnd = collectLndData();
    const node_pubkey = lnd.info.identity_pubkey;

    // Build tx timestamp map
    const tx_map = new Map<string, number>();
    for (const tx of lnd.transactions) {
        if (tx.tx_hash && Number(tx.time_stamp) > 0) {
            tx_map.set(tx.tx_hash, Number(tx.time_stamp));
        }
    }
    console.log(`    tx_map: ${tx_map.size} transactions with timestamps`);

    // Collect DB data
    const db = new Database(DB_PATH, {readonly: true});
    const db_data = collectDbData(db, node_pubkey);

    // Build DB metric map
    const db_metrics = new Map<string, bigint>();
    for (const row of db_data.metric_totals) {
        db_metrics.set(row.metric, BigInt(row.total));
    }

    // Build checkpoint map
    const checkpoint_map = new Map<string, number>();
    for (const cp of db_data.checkpoints) {
        checkpoint_map.set(cp.data_type, cp.last_index);
    }

    // Print node info
    header('NODE INFO');
    kv('Pubkey:', node_pubkey);
    kv('Alias:', lnd.info.alias);
    kv('Open channels:', lnd.channels.length);
    kv('Closed channels:', lnd.closed_channels.length);
    kv('Total capacity (sat):', lnd.channels.reduce((s, c) => s + BigInt(c.capacity), 0n));
    kv('Total local balance (sat):', lnd.channels.reduce((s, c) => s + BigInt(c.local_balance), 0n));

    subheader('Checkpoints');
    kv('payments:', checkpoint_map.get('payments') ?? 'NOT SET');
    kv('invoices:', checkpoint_map.get('invoices') ?? 'NOT SET');
    kv('forwards:', checkpoint_map.get('forwards') ?? 'NOT SET');

    subheader('DB Metric Totals');
    for (const row of db_data.metric_totals) {
        kv(`${row.metric} (${row.count} rows):`, `${BigInt(row.total)} msat (${BigInt(row.total) / 1000n} sat)`);
    }

    // Run analyses
    const expected_metrics = new Map<string, bigint>();

    const opens = analyzeChannelOpens(
        lnd.channels, lnd.closed_channels, tx_map,
        db_metrics.get('channel_opens') || 0n,
        db_metrics.get('channel_opens_remote') || 0n,
    );
    expected_metrics.set('channel_opens', opens.local);
    expected_metrics.set('channel_opens_remote', opens.remote);

    expected_metrics.set(
        'payments_out',
        analyzePayments(lnd.payments, db_metrics.get('payments_out') || 0n, checkpoint_map.get('payments') ?? 0),
    );

    expected_metrics.set(
        'invoices_in',
        analyzeInvoices(lnd.invoices, db_metrics.get('invoices_in') || 0n, checkpoint_map.get('invoices') ?? 0),
    );

    expected_metrics.set(
        'forward_fees',
        analyzeForwards(lnd.forwards, db_metrics.get('forward_fees') || 0n, checkpoint_map.get('forwards') ?? 0),
    );

    const closes = analyzeChannelCloses(
        lnd.closed_channels, tx_map,
        db_metrics.get('channel_closes') || 0n,
        db_metrics.get('channel_closes_remote') || 0n,
    );
    expected_metrics.set('channel_closes', closes.local);
    expected_metrics.set('channel_closes_remote', closes.remote);

    const recon = analyzeBalanceReconstruction(lnd.channels, db_metrics, expected_metrics);

    printSummary(expected_metrics, db_metrics, recon);

    db.close();
    console.log('\n  Done.\n');
}

main();
