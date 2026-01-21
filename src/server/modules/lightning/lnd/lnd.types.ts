/* ============================================
   LND gRPC Response Types
   These types represent raw responses from LND RPC calls
   ============================================ */

/* Payment Types */

export enum LndPaymentStatus {
	UNKNOWN = 'UNKNOWN',
	IN_FLIGHT = 'IN_FLIGHT',
	SUCCEEDED = 'SUCCEEDED',
	FAILED = 'FAILED',
	INITIATED = 'INITIATED',
}

export enum LndPaymentFailureReason {
	FAILURE_REASON_NONE = 'FAILURE_REASON_NONE',
	FAILURE_REASON_TIMEOUT = 'FAILURE_REASON_TIMEOUT',
	FAILURE_REASON_NO_ROUTE = 'FAILURE_REASON_NO_ROUTE',
	FAILURE_REASON_ERROR = 'FAILURE_REASON_ERROR',
	FAILURE_REASON_INCORRECT_PAYMENT_DETAILS = 'FAILURE_REASON_INCORRECT_PAYMENT_DETAILS',
	FAILURE_REASON_INSUFFICIENT_BALANCE = 'FAILURE_REASON_INSUFFICIENT_BALANCE',
	FAILURE_REASON_CANCELED = 'FAILURE_REASON_CANCELED',
}

export enum LndHTLCStatus {
	IN_FLIGHT = 'IN_FLIGHT',
	SUCCEEDED = 'SUCCEEDED',
	FAILED = 'FAILED',
}

export type LndHop = {
	chan_id: string;
	chan_capacity: string;
	amt_to_forward: string;
	fee: string;
	expiry: number;
	amt_to_forward_msat: string;
	fee_msat: string;
	pub_key: string;
	tlv_payload: boolean;
	mpp_record?: LndMPPRecord;
	amp_record?: LndAMPRecord;
	custom_records: {[key: string]: Buffer};
	metadata: Buffer;
	blinding_point: Buffer;
	encrypted_data: Buffer;
	total_amt_msat: string;
};

export type LndMPPRecord = {
	payment_addr: Buffer;
	total_amt_msat: string;
};

export type LndAMPRecord = {
	root_share: Buffer;
	set_id: Buffer;
	child_index: number;
};

export type LndRoute = {
	total_time_lock: number;
	total_fees: string;
	total_amt: string;
	hops: LndHop[];
	total_fees_msat: string;
	total_amt_msat: string;
	first_hop_amount_msat: string;
	custom_channel_data: Buffer;
};

export type LndFailure = {
	code: LndFailureCode;
	channel_update?: LndChannelUpdate;
	htlc_msat: string;
	onion_sha_256: Buffer;
	cltv_expiry: number;
	flags: number;
	failure_source_index: number;
	height: number;
};

export enum LndFailureCode {
	RESERVED = 'RESERVED',
	INCORRECT_OR_UNKNOWN_PAYMENT_DETAILS = 'INCORRECT_OR_UNKNOWN_PAYMENT_DETAILS',
	INCORRECT_PAYMENT_AMOUNT = 'INCORRECT_PAYMENT_AMOUNT',
	FINAL_INCORRECT_CLTV_EXPIRY = 'FINAL_INCORRECT_CLTV_EXPIRY',
	FINAL_INCORRECT_HTLC_AMOUNT = 'FINAL_INCORRECT_HTLC_AMOUNT',
	FINAL_EXPIRY_TOO_SOON = 'FINAL_EXPIRY_TOO_SOON',
	INVALID_REALM = 'INVALID_REALM',
	EXPIRY_TOO_SOON = 'EXPIRY_TOO_SOON',
	INVALID_ONION_VERSION = 'INVALID_ONION_VERSION',
	INVALID_ONION_HMAC = 'INVALID_ONION_HMAC',
	INVALID_ONION_KEY = 'INVALID_ONION_KEY',
	AMOUNT_BELOW_MINIMUM = 'AMOUNT_BELOW_MINIMUM',
	FEE_INSUFFICIENT = 'FEE_INSUFFICIENT',
	INCORRECT_CLTV_EXPIRY = 'INCORRECT_CLTV_EXPIRY',
	CHANNEL_DISABLED = 'CHANNEL_DISABLED',
	TEMPORARY_CHANNEL_FAILURE = 'TEMPORARY_CHANNEL_FAILURE',
	REQUIRED_NODE_FEATURE_MISSING = 'REQUIRED_NODE_FEATURE_MISSING',
	REQUIRED_CHANNEL_FEATURE_MISSING = 'REQUIRED_CHANNEL_FEATURE_MISSING',
	UNKNOWN_NEXT_PEER = 'UNKNOWN_NEXT_PEER',
	TEMPORARY_NODE_FAILURE = 'TEMPORARY_NODE_FAILURE',
	PERMANENT_NODE_FAILURE = 'PERMANENT_NODE_FAILURE',
	PERMANENT_CHANNEL_FAILURE = 'PERMANENT_CHANNEL_FAILURE',
	EXPIRY_TOO_FAR = 'EXPIRY_TOO_FAR',
	MPP_TIMEOUT = 'MPP_TIMEOUT',
	INVALID_ONION_PAYLOAD = 'INVALID_ONION_PAYLOAD',
	INVALID_ONION_BLINDING = 'INVALID_ONION_BLINDING',
	INTERNAL_FAILURE = 'INTERNAL_FAILURE',
	UNKNOWN_FAILURE = 'UNKNOWN_FAILURE',
	UNREADABLE_FAILURE = 'UNREADABLE_FAILURE',
}

export type LndChannelUpdate = {
	signature: Buffer;
	chain_hash: Buffer;
	chan_id: string;
	timestamp: number;
	message_flags: number;
	channel_flags: number;
	time_lock_delta: number;
	htlc_minimum_msat: string;
	base_fee: number;
	fee_rate: number;
	htlc_maximum_msat: string;
	extra_opaque_data: Buffer;
};

export type LndHTLCAttempt = {
	attempt_id: string;
	status: LndHTLCStatus;
	route?: LndRoute;
	attempt_time_ns: string;
	resolve_time_ns: string;
	failure?: LndFailure;
	preimage: Buffer;
};

export type LndPayment = {
	payment_hash: string;
	value: string;
	creation_date: string;
	fee: string;
	payment_preimage: string;
	value_sat: string;
	value_msat: string;
	payment_request: string;
	status: LndPaymentStatus;
	fee_sat: string;
	fee_msat: string;
	creation_time_ns: string;
	settle_time_ns?: string;
	htlcs: LndHTLCAttempt[];
	payment_index: string;
	failure_reason: LndPaymentFailureReason;
	first_hop_custom_records: {[key: string]: Buffer};
};

export type LndListPaymentsRequest = {
	include_incomplete?: boolean;
	index_offset?: string;
	max_payments?: string;
	reversed?: boolean;
	count_total_payments?: boolean;
	creation_date_start?: string;
	creation_date_end?: string;
};

export type LndListPaymentsResponse = {
	payments: LndPayment[];
	first_index_offset: string;
	last_index_offset: string;
	total_num_payments: string;
};

/* Invoice Types */

export enum LndInvoiceState {
	OPEN = 'OPEN',
	SETTLED = 'SETTLED',
	CANCELED = 'CANCELED',
	ACCEPTED = 'ACCEPTED',
}

export enum LndInvoiceHTLCState {
	ACCEPTED = 'ACCEPTED',
	SETTLED = 'SETTLED',
	CANCELED = 'CANCELED',
}

export type LndHopHint = {
	node_id: string;
	chan_id: string;
	fee_base_msat: number;
	fee_proportional_millionths: number;
	cltv_expiry_delta: number;
};

export type LndRouteHint = {
	hop_hints: LndHopHint[];
};

export type LndInvoiceHTLC = {
	chan_id: string;
	htlc_index: string;
	amt_msat: string;
	accept_height: number;
	accept_time: string;
	resolve_time: string;
	expiry_height: number;
	state: LndInvoiceHTLCState;
	custom_records: {[key: string]: Buffer};
	mpp_total_amt_msat: string;
	amp?: LndAMP;
	custom_channel_data: Buffer;
};

export type LndAMP = {
	root_share: Buffer;
	set_id: Buffer;
	child_index: number;
	hash: Buffer;
	preimage: Buffer;
};

export type LndAMPInvoiceState = {
	state: LndInvoiceState;
	settle_index: string;
	settle_time: string;
	amt_paid_msat: string;
};

export type LndFeature = {
	name: string;
	is_required: boolean;
	is_known: boolean;
};

export type LndBlindedPathConfig = {
	min_num_real_hops: number;
	num_hops: number;
	max_num_paths: number;
};

export type LndInvoice = {
	memo: string;
	r_preimage: Buffer;
	r_hash: Buffer;
	value: string;
	value_msat: string;
	settled: boolean;
	creation_date: string;
	settle_date: string;
	payment_request: string;
	description_hash: Buffer;
	expiry: string;
	fallback_addr: string;
	cltv_expiry: string;
	route_hints: LndRouteHint[];
	private: boolean;
	add_index: string;
	settle_index: string;
	amt_paid: string;
	amt_paid_sat: string;
	amt_paid_msat: string;
	state: LndInvoiceState;
	htlcs: LndInvoiceHTLC[];
	features: {[key: number]: LndFeature};
	is_keysend: boolean;
	payment_addr: Buffer;
	is_amp: boolean;
	amp_invoice_state: {[key: string]: LndAMPInvoiceState};
	is_blinded: boolean;
	blinded_path_config?: LndBlindedPathConfig;
};

export type LndListInvoicesRequest = {
	pending_only?: boolean;
	index_offset?: string;
	num_max_invoices?: number;
	reversed?: boolean;
	creation_date_start?: string;
	creation_date_end?: string;
};

export type LndListInvoicesResponse = {
	invoices: LndInvoice[];
	last_index_offset: string;
	first_index_offset: string;
};

/* Forwarding Types */

export type LndForwardingEvent = {
	timestamp: string;
	chan_id_in: string;
	chan_id_out: string;
	amt_in: string;
	amt_out: string;
	fee: string;
	fee_msat: string;
	amt_in_msat: string;
	amt_out_msat: string;
	timestamp_ns: string;
	peer_alias_in: string;
	peer_alias_out: string;
	incoming_htlc_id: string;
	outgoing_htlc_id: string;
};

export type LndForwardingHistoryRequest = {
	start_time?: number;
	end_time?: number;
	index_offset?: number;
	num_max_events?: number;
	peer_alias_lookup?: boolean;
	incoming_chan_ids?: string[];
	outgoing_chan_ids?: string[];
};

export type LndForwardingHistoryResponse = {
	forwarding_events: LndForwardingEvent[];
	last_offset_index: number;
};

/* Channel Types */

export enum LndClosureType {
	COOPERATIVE_CLOSE = 'COOPERATIVE_CLOSE',
	LOCAL_FORCE_CLOSE = 'LOCAL_FORCE_CLOSE',
	REMOTE_FORCE_CLOSE = 'REMOTE_FORCE_CLOSE',
	BREACH_CLOSE = 'BREACH_CLOSE',
	FUNDING_CANCELED = 'FUNDING_CANCELED',
	ABANDONED = 'ABANDONED',
}

export enum LndInitiator {
	INITIATOR_UNKNOWN = 'INITIATOR_UNKNOWN',
	INITIATOR_LOCAL = 'INITIATOR_LOCAL',
	INITIATOR_REMOTE = 'INITIATOR_REMOTE',
	INITIATOR_BOTH = 'INITIATOR_BOTH',
}

export enum LndResolutionType {
	TYPE_UNKNOWN = 'TYPE_UNKNOWN',
	ANCHOR = 'ANCHOR',
	INCOMING_HTLC = 'INCOMING_HTLC',
	OUTGOING_HTLC = 'OUTGOING_HTLC',
	COMMIT = 'COMMIT',
}

export enum LndResolutionOutcome {
	OUTCOME_UNKNOWN = 'OUTCOME_UNKNOWN',
	CLAIMED = 'CLAIMED',
	UNCLAIMED = 'UNCLAIMED',
	ABANDONED = 'ABANDONED',
	FIRST_STAGE = 'FIRST_STAGE',
	TIMEOUT = 'TIMEOUT',
}

export type LndOutPoint = {
	txid_bytes: Buffer;
	txid_str: string;
	output_index: number;
};

export type LndResolution = {
	resolution_type: LndResolutionType;
	outcome: LndResolutionOutcome;
	outpoint: LndOutPoint;
	amount_sat: string;
	sweep_txid: string;
};

export type LndChannelCloseSummary = {
	channel_point: string;
	chan_id: string;
	chain_hash: string;
	closing_tx_hash: string;
	remote_pubkey: string;
	capacity: string;
	close_height: number;
	settled_balance: string;
	time_locked_balance: string;
	close_type: LndClosureType;
	open_initiator: LndInitiator;
	close_initiator: LndInitiator;
	resolutions: LndResolution[];
	alias_scids: string[];
	zero_conf_confirmed_scid: string;
	custom_channel_data: Buffer;
};

export type LndClosedChannelsRequest = {
	cooperative?: boolean;
	local_force?: boolean;
	remote_force?: boolean;
	breach?: boolean;
	funding_canceled?: boolean;
	abandoned?: boolean;
};

export type LndClosedChannelsResponse = {
	channels: LndChannelCloseSummary[];
};

export enum LndCommitmentType {
	UNKNOWN_COMMITMENT_TYPE = 'UNKNOWN_COMMITMENT_TYPE',
	LEGACY = 'LEGACY',
	STATIC_REMOTE_KEY = 'STATIC_REMOTE_KEY',
	ANCHORS = 'ANCHORS',
	SCRIPT_ENFORCED_LEASE = 'SCRIPT_ENFORCED_LEASE',
	SIMPLE_TAPROOT = 'SIMPLE_TAPROOT',
	SIMPLE_TAPROOT_OVERLAY = 'SIMPLE_TAPROOT_OVERLAY',
}

export type LndChannelConstraints = {
	csv_delay: number;
	chan_reserve_sat: string;
	dust_limit_sat: string;
	max_pending_amt_msat: string;
	min_htlc_msat: string;
	max_accepted_htlcs: number;
};

export type LndHTLC = {
	incoming: boolean;
	amount: string;
	hash_lock: Buffer;
	expiration_height: number;
	htlc_index: string;
	forwarding_channel: string;
	forwarding_htlc_index: string;
	locked_in: boolean;
};

export type LndChannel = {
	active: boolean;
	remote_pubkey: string;
	channel_point: string;
	chan_id: string;
	capacity: string;
	local_balance: string;
	remote_balance: string;
	commit_fee: string;
	commit_weight: string;
	fee_per_kw: string;
	unsettled_balance: string;
	total_satoshis_sent: string;
	total_satoshis_received: string;
	num_updates: string;
	pending_htlcs: LndHTLC[];
	csv_delay: number;
	private: boolean;
	initiator: boolean;
	chan_status_flags: string;
	local_chan_reserve_sat: string;
	remote_chan_reserve_sat: string;
	static_remote_key: boolean;
	commitment_type: LndCommitmentType;
	lifetime: string;
	uptime: string;
	close_address: string;
	push_amount_sat: string;
	thaw_height: number;
	local_constraints: LndChannelConstraints;
	remote_constraints: LndChannelConstraints;
	alias_scids: string[];
	zero_conf: boolean;
	zero_conf_confirmed_scid: string;
	peer_alias: string;
	peer_scid_alias: string;
	memo: string;
	custom_channel_data: Buffer;
};

export type LndListChannelsRequest = {
	active_only?: boolean;
	inactive_only?: boolean;
	public_only?: boolean;
	private_only?: boolean;
	peer?: Buffer;
	peer_alias_lookup?: boolean;
};

export type LndListChannelsResponse = {
	channels: LndChannel[];
};

/* Transaction Types */

export enum LndOutputScriptType {
	SCRIPT_TYPE_PUBKEY_HASH = 'SCRIPT_TYPE_PUBKEY_HASH',
	SCRIPT_TYPE_SCRIPT_HASH = 'SCRIPT_TYPE_SCRIPT_HASH',
	SCRIPT_TYPE_WITNESS_V0_PUBKEY_HASH = 'SCRIPT_TYPE_WITNESS_V0_PUBKEY_HASH',
	SCRIPT_TYPE_WITNESS_V0_SCRIPT_HASH = 'SCRIPT_TYPE_WITNESS_V0_SCRIPT_HASH',
	SCRIPT_TYPE_PUBKEY = 'SCRIPT_TYPE_PUBKEY',
	SCRIPT_TYPE_MULTISIG = 'SCRIPT_TYPE_MULTISIG',
	SCRIPT_TYPE_NULLDATA = 'SCRIPT_TYPE_NULLDATA',
	SCRIPT_TYPE_NON_STANDARD = 'SCRIPT_TYPE_NON_STANDARD',
	SCRIPT_TYPE_WITNESS_UNKNOWN = 'SCRIPT_TYPE_WITNESS_UNKNOWN',
	SCRIPT_TYPE_WITNESS_V1_TAPROOT = 'SCRIPT_TYPE_WITNESS_V1_TAPROOT',
}

export type LndOutputDetail = {
	output_type: LndOutputScriptType;
	address: string;
	pk_script: string;
	output_index: string;
	amount: string;
	is_our_address: boolean;
};

export type LndPreviousOutPoint = {
	outpoint: string;
	is_our_output: boolean;
};

export type LndTransaction = {
	tx_hash: string;
	amount: string;
	num_confirmations: number;
	block_hash: string;
	block_height: number;
	time_stamp: string;
	total_fees: string;
	dest_addresses: string[];
	output_details: LndOutputDetail[];
	raw_tx_hex: string;
	label: string;
	previous_outpoints: LndPreviousOutPoint[];
};

export type LndGetTransactionsRequest = {
	start_height?: number;
	end_height?: number;
	account?: string;
	index_offset?: number;
	max_transactions?: number;
};

export type LndGetTransactionsResponse = {
	transactions: LndTransaction[];
	last_index: string;
	first_index: string;
};
