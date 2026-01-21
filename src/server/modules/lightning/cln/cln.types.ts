/* ============================================
   CLN gRPC Response Types
   These types represent raw responses from CLN RPC calls
   ============================================ */

/* Common Types */

export type ClnAmount = {
	msat: string;
};

export enum ClnChannelSide {
	LOCAL = 'LOCAL',
	REMOTE = 'REMOTE',
}

export enum ClnChannelState {
	Openingd = 'Openingd',
	ChanneldAwaitingLockin = 'ChanneldAwaitingLockin',
	ChanneldNormal = 'ChanneldNormal',
	ChanneldShuttingDown = 'ChanneldShuttingDown',
	ClosingdSigexchange = 'ClosingdSigexchange',
	ClosingdComplete = 'ClosingdComplete',
	AwaitingUnilateral = 'AwaitingUnilateral',
	FundingSpendSeen = 'FundingSpendSeen',
	Onchain = 'Onchain',
	DualopendOpenInit = 'DualopendOpenInit',
	DualopendAwaitingLockin = 'DualopendAwaitingLockin',
	ChanneldAwaitingSplice = 'ChanneldAwaitingSplice',
	DualopendOpenCommitted = 'DualopendOpenCommitted',
	DualopendOpenCommittReady = 'DualopendOpenCommittReady',
}

/* Payment Types (ListPays) */

export enum ClnPayStatus {
	PENDING = 'PENDING',
	COMPLETE = 'COMPLETE',
	FAILED = 'FAILED',
}

export type ClnPay = {
	payment_hash: Buffer;
	status: ClnPayStatus;
	destination?: Buffer;
	created_at: number;
	label?: string;
	bolt11?: string;
	bolt12?: string;
	amount_msat?: ClnAmount;
	amount_sent_msat?: ClnAmount;
	erroronion?: Buffer;
	description?: string;
	completed_at?: number;
	preimage?: Buffer;
	number_of_parts?: number;
	created_index?: number;
	updated_index?: number;
};

export type ClnListPaysRequest = {
	bolt11?: string;
	payment_hash?: Buffer;
	status?: ClnPayStatus;
	index?: 'CREATED' | 'UPDATED';
	start?: number;
	limit?: number;
};

export type ClnListPaysResponse = {
	pays: ClnPay[];
};

/* Invoice Types (ListInvoices) */

export enum ClnInvoiceStatus {
	UNPAID = 'UNPAID',
	PAID = 'PAID',
	EXPIRED = 'EXPIRED',
}

export type ClnInvoice = {
	label: string;
	description?: string;
	payment_hash: Buffer;
	status: ClnInvoiceStatus;
	expires_at: number;
	amount_msat?: ClnAmount;
	bolt11?: string;
	bolt12?: string;
	local_offer_id?: Buffer;
	pay_index?: number;
	amount_received_msat?: ClnAmount;
	paid_at?: number;
	payment_preimage?: Buffer;
	invreq_payer_note?: string;
	created_index?: number;
	updated_index?: number;
};

export type ClnListInvoicesRequest = {
	label?: string;
	invstring?: string;
	payment_hash?: Buffer;
	offer_id?: string;
	index?: 'CREATED' | 'UPDATED';
	start?: number;
	limit?: number;
};

export type ClnListInvoicesResponse = {
	invoices: ClnInvoice[];
};

/* Forwarding Types (ListForwards) */

export enum ClnForwardStatus {
	OFFERED = 'OFFERED',
	SETTLED = 'SETTLED',
	LOCAL_FAILED = 'LOCAL_FAILED',
	FAILED = 'FAILED',
}

export type ClnForward = {
	in_channel: string;
	in_msat: ClnAmount;
	status: ClnForwardStatus;
	received_time: number;
	out_channel?: string;
	fee_msat?: ClnAmount;
	out_msat?: ClnAmount;
	style?: 'LEGACY' | 'TLV';
	in_htlc_id?: number;
	out_htlc_id?: number;
	created_index?: number;
	updated_index?: number;
	resolved_time?: number;
	failcode?: number;
	failreason?: string;
};

export type ClnListForwardsRequest = {
	status?: ClnForwardStatus;
	in_channel?: string;
	out_channel?: string;
	index?: 'CREATED' | 'UPDATED';
	start?: number;
	limit?: number;
};

export type ClnListForwardsResponse = {
	forwards: ClnForward[];
};

/* Channel Types (ListPeerChannels) */

export type ClnChannelAlias = {
	local?: string;
	remote?: string;
};

export type ClnChannelFunding = {
	local_funds_msat?: ClnAmount;
	remote_funds_msat?: ClnAmount;
	pushed_msat?: ClnAmount;
	fee_paid_msat?: ClnAmount;
	fee_rcvd_msat?: ClnAmount;
};

export type ClnChannel = {
	peer_id: Buffer;
	peer_connected: boolean;
	state: ClnChannelState;
	scratch_txid?: Buffer;
	owner?: string;
	short_channel_id?: string;
	channel_id?: Buffer;
	funding_txid?: Buffer;
	funding_outnum?: number;
	initial_feerate?: string;
	last_feerate?: string;
	next_feerate?: string;
	next_fee_step?: number;
	close_to?: Buffer;
	private?: boolean;
	opener: ClnChannelSide;
	closer?: ClnChannelSide;
	funding?: ClnChannelFunding;
	to_us_msat?: ClnAmount;
	min_to_us_msat?: ClnAmount;
	max_to_us_msat?: ClnAmount;
	total_msat?: ClnAmount;
	fee_base_msat?: ClnAmount;
	fee_proportional_millionths?: number;
	dust_limit_msat?: ClnAmount;
	max_total_htlc_in_msat?: ClnAmount;
	their_reserve_msat?: ClnAmount;
	our_reserve_msat?: ClnAmount;
	spendable_msat?: ClnAmount;
	receivable_msat?: ClnAmount;
	minimum_htlc_in_msat?: ClnAmount;
	minimum_htlc_out_msat?: ClnAmount;
	maximum_htlc_out_msat?: ClnAmount;
	their_to_self_delay?: number;
	our_to_self_delay?: number;
	max_accepted_htlcs?: number;
	alias?: ClnChannelAlias;
	status?: string[];
	in_payments_offered?: number;
	in_offered_msat?: ClnAmount;
	in_payments_fulfilled?: number;
	in_fulfilled_msat?: ClnAmount;
	out_payments_offered?: number;
	out_offered_msat?: ClnAmount;
	out_payments_fulfilled?: number;
	out_fulfilled_msat?: ClnAmount;
	close_to_addr?: string;
	ignore_fee_limits?: boolean;
	last_stable_connection?: number;
	lost_state?: boolean;
	reestablished?: boolean;
	last_tx_fee_msat?: ClnAmount;
	direction?: number;
	their_max_htlc_value_in_flight_msat?: ClnAmount;
	our_max_htlc_value_in_flight_msat?: ClnAmount;
};

export type ClnListPeerChannelsRequest = {
	id?: Buffer;
	short_channel_id?: string;
};

export type ClnListPeerChannelsResponse = {
	channels: ClnChannel[];
};

/* Closed Channel Types (ListClosedChannels) */

export enum ClnCloseCause {
	UNKNOWN = 'UNKNOWN',
	LOCAL = 'LOCAL',
	USER = 'USER',
	REMOTE = 'REMOTE',
	PROTOCOL = 'PROTOCOL',
	ONCHAIN = 'ONCHAIN',
}

export type ClnClosedChannel = {
	peer_id?: Buffer;
	channel_id: Buffer;
	short_channel_id?: string;
	alias?: ClnChannelAlias;
	opener: ClnChannelSide;
	closer?: ClnChannelSide;
	private: boolean;
	total_local_commitments: number;
	total_remote_commitments: number;
	total_htlcs_sent: number;
	funding_txid: Buffer;
	funding_outnum: number;
	leased: boolean;
	funding_fee_paid_msat?: ClnAmount;
	funding_fee_rcvd_msat?: ClnAmount;
	funding_pushed_msat?: ClnAmount;
	total_msat: ClnAmount;
	final_to_us_msat: ClnAmount;
	min_to_us_msat: ClnAmount;
	max_to_us_msat: ClnAmount;
	last_commitment_txid?: Buffer;
	last_commitment_fee_msat?: ClnAmount;
	close_cause: ClnCloseCause;
	last_stable_connection?: number;
};

export type ClnListClosedChannelsRequest = {
	id?: Buffer;
};

export type ClnListClosedChannelsResponse = {
	closedchannels: ClnClosedChannel[];
};

/* Transaction Types (ListTransactions) */

export type ClnTransactionInput = {
	txid: Buffer;
	index: number;
	sequence: number;
};

export type ClnTransactionOutput = {
	index: number;
	scriptPubKey: Buffer;
	amount_msat: ClnAmount;
};

export type ClnTransaction = {
	hash: Buffer;
	rawtx: Buffer;
	blockheight: number;
	txindex: number;
	locktime: number;
	version: number;
	inputs: ClnTransactionInput[];
	outputs: ClnTransactionOutput[];
};

export type ClnListTransactionsRequest = Record<string, never>;

export type ClnListTransactionsResponse = {
	transactions: ClnTransaction[];
};
