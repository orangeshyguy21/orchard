/* Application Dependencies */
import {LightningRequestType} from '@server/modules/lightning/lightning.enums';
import {
	LightningPayment,
	LightningInvoice,
	LightningForward,
	LightningChannel,
	LightningClosedChannel,
	LightningTransaction,
} from '@server/modules/lightning/lightning/lightning.types';
/* Local Dependencies */
import {
	LndPayment,
	LndPaymentStatus,
	LndInvoice,
	LndInvoiceState,
	LndForwardingEvent,
	LndChannel,
	LndChannelCloseSummary,
	LndClosureType,
	LndInitiator,
	LndTransaction,
	LndListPaymentsResponse,
	LndListInvoicesResponse,
	LndForwardingHistoryResponse,
	LndListChannelsResponse,
	LndClosedChannelsResponse,
	LndGetTransactionsResponse,
} from './lnd.types';

export function mapRequestDescription(description: string | null): string | null {
	if (!description) return null;
	if (description === '') return null;
	return description;
}

export function mapRequestExpiry(request: any): number {
	if (request?.expiry) return Number(request?.timestamp) + Number(request.expiry);
	return null;
}

export function mapRequestType(): LightningRequestType {
	return LightningRequestType.BOLT11_INVOICE;
}

/* ============================================
   LND to Common Type Mapping Helpers
   ============================================ */

/**
 * Maps LND payment status to common status
 */
function mapLndPaymentStatus(status: LndPaymentStatus): LightningPayment['status'] {
	switch (status) {
		case LndPaymentStatus.SUCCEEDED:
			return 'succeeded';
		case LndPaymentStatus.FAILED:
			return 'failed';
		case LndPaymentStatus.IN_FLIGHT:
		case LndPaymentStatus.INITIATED:
		case LndPaymentStatus.UNKNOWN:
		default:
			return 'pending';
	}
}

/**
 * Maps LND ListPaymentsResponse to common LightningPayment[]
 */
export function mapLndPayments(response: LndListPaymentsResponse): LightningPayment[] {
	const payments = response?.payments ?? [];
	return payments.map((p: LndPayment) => ({
		payment_hash: p.payment_hash ?? '',
		value_msat: p.value_msat ?? '0',
		fee_msat: p.fee_msat ?? '0',
		status: mapLndPaymentStatus(p.status),
		creation_time: Math.floor(Number(p.creation_time_ns ?? 0) / 1_000_000_000),
	}));
}

/**
 * Maps LND invoice state to common state
 */
function mapLndInvoiceState(state: LndInvoiceState): LightningInvoice['state'] {
	switch (state) {
		case LndInvoiceState.SETTLED:
			return 'settled';
		case LndInvoiceState.CANCELED:
			return 'canceled';
		case LndInvoiceState.ACCEPTED:
			return 'accepted';
		case LndInvoiceState.OPEN:
		default:
			return 'open';
	}
}

/**
 * Maps LND ListInvoicesResponse to common LightningInvoice[]
 */
export function mapLndInvoices(response: LndListInvoicesResponse): LightningInvoice[] {
	const invoices = response?.invoices ?? [];
	return invoices.map((i: LndInvoice) => ({
		payment_hash: Buffer.isBuffer(i.r_hash) ? i.r_hash.toString('hex') : '',
		value_msat: i.value_msat ?? '0',
		amt_paid_msat: i.amt_paid_msat ?? '0',
		state: mapLndInvoiceState(i.state),
		creation_date: Number(i.creation_date ?? 0),
		settle_date: i.settle_date ? Number(i.settle_date) : null,
	}));
}

/**
 * Maps LND ForwardingHistoryResponse to common LightningForward[]
 */
export function mapLndForwards(response: LndForwardingHistoryResponse): LightningForward[] {
	const events = response?.forwarding_events ?? [];
	return events.map((e: LndForwardingEvent) => ({
		timestamp: Math.floor(Number(e.timestamp_ns ?? 0) / 1_000_000_000),
		amt_in_msat: e.amt_in_msat ?? '0',
		amt_out_msat: e.amt_out_msat ?? '0',
		fee_msat: e.fee_msat ?? '0',
	}));
}

/**
 * Extracts funding txid from channel_point (format: txid:index)
 */
function extractLndFundingTxid(channel_point: string): string {
	if (!channel_point) return '';
	const parts = channel_point.split(':');
	return parts[0] ?? '';
}

/**
 * Maps LND ListChannelsResponse to common LightningChannel[]
 */
export function mapLndChannels(response: LndListChannelsResponse): LightningChannel[] {
	const channels = response?.channels ?? [];
	return channels.map((c: LndChannel) => ({
		channel_point: c.channel_point ?? '',
		chan_id: c.chan_id ?? '',
		capacity: c.capacity ?? '0',
		local_balance: c.local_balance ?? '0',
		remote_balance: c.remote_balance ?? '0',
		initiator: c.initiator ?? null,
		push_amount_sat: c.push_amount_sat ? String(c.push_amount_sat) : null,
		private: c.private ?? false,
		active: c.active ?? false,
		funding_txid: extractLndFundingTxid(c.channel_point),
	}));
}

/**
 * Maps LND close type enum to common close type
 */
function mapLndCloseType(close_type: LndClosureType): LightningClosedChannel['close_type'] {
	switch (close_type) {
		case LndClosureType.COOPERATIVE_CLOSE:
			return 'cooperative';
		case LndClosureType.LOCAL_FORCE_CLOSE:
			return 'local_force';
		case LndClosureType.REMOTE_FORCE_CLOSE:
			return 'remote_force';
		case LndClosureType.BREACH_CLOSE:
			return 'breach';
		case LndClosureType.FUNDING_CANCELED:
			return 'funding_canceled';
		case LndClosureType.ABANDONED:
			return 'abandoned';
		default:
			return 'unknown';
	}
}

/**
 * Maps LND initiator enum to common initiator
 */
function mapLndInitiator(initiator: LndInitiator): LightningClosedChannel['open_initiator'] {
	switch (initiator) {
		case LndInitiator.INITIATOR_LOCAL:
			return 'local';
		case LndInitiator.INITIATOR_REMOTE:
			return 'remote';
		case LndInitiator.INITIATOR_BOTH:
			return 'both';
		case LndInitiator.INITIATOR_UNKNOWN:
		default:
			return 'unknown';
	}
}

/**
 * Maps LND ClosedChannelsResponse to common LightningClosedChannel[]
 */
export function mapLndClosedChannels(response: LndClosedChannelsResponse): LightningClosedChannel[] {
	const channels = response?.channels ?? [];
	return channels.map((c: LndChannelCloseSummary) => ({
		channel_point: c.channel_point ?? '',
		chan_id: c.chan_id ?? '',
		capacity: c.capacity ?? '0',
		close_height: c.close_height ?? 0,
		settled_balance: c.settled_balance ?? '0',
		time_locked_balance: c.time_locked_balance ? String(c.time_locked_balance) : null,
		close_type: mapLndCloseType(c.close_type),
		open_initiator: mapLndInitiator(c.open_initiator),
		funding_txid: extractLndFundingTxid(c.channel_point),
	}));
}

/**
 * Maps LND GetTransactionsResponse to common LightningTransaction[]
 */
export function mapLndTransactions(response: LndGetTransactionsResponse): LightningTransaction[] {
	const transactions = response?.transactions ?? [];
	return transactions.map((t: LndTransaction) => ({
		tx_hash: t.tx_hash ?? '',
		time_stamp: Number(t.time_stamp ?? 0),
	}));
}
