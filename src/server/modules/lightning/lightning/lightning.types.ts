import {LightningRequestType} from '@server/modules/lightning/lightning.enums';

export type LightningInfo = {
	version: string;
	commit_hash: string;
	identity_pubkey: string;
	alias: string;
	color: string;
	num_pending_channels: number;
	num_active_channels: number;
	num_inactive_channels: number;
	num_peers: number;
	block_height: number;
	block_hash: string;
	best_header_timestamp: number;
	synced_to_chain: boolean;
	synced_to_graph: boolean;
	testnet: boolean;
	chains: {chain: string; network: string}[];
	uris: string[];
	require_htlc_interceptor: boolean;
	store_final_htlc_resolutions: boolean;
	features: {[key: string]: {name: string; is_required: boolean; is_known: boolean}};
};

export type LightningChannelBalance = {
	balance: string;
	pending_open_balance: string;
	local_balance: {sat: string; msat: string};
	remote_balance: {sat: string; msat: string};
	unsettled_local_balance: {sat: string; msat: string};
	unsettled_remote_balance: {sat: string; msat: string};
	pending_open_local_balance: {sat: string; msat: string};
	pending_open_remote_balance: {sat: string; msat: string};
	custom_channel_data: Buffer;
};

export type LightningCustomChannels = {
	open_channels: {[key: string]: {asset_id: string; name: string; local_balance: number; remote_balance: number}};
	pending_channels: {[key: string]: {asset_id: string; name: string; local_balance: number; remote_balance: number}};
};

export type LightningRequest = {
	type: LightningRequestType;
	valid: boolean;
	expiry: number | null;
	description: string | null;
	offer_quantity_max: number | null;
};

export enum PaymentStatus {
	UNKNOWN = 'UNKNOWN',
	IN_FLIGHT = 'IN_FLIGHT',
	SUCCEEDED = 'SUCCEEDED',
	FAILED = 'FAILED',
	INITIATED = 'INITIATED',
}

export enum PaymentFailureReason {
	FAILURE_REASON_NONE = 'FAILURE_REASON_NONE',
	FAILURE_REASON_TIMEOUT = 'FAILURE_REASON_TIMEOUT',
	FAILURE_REASON_NO_ROUTE = 'FAILURE_REASON_NO_ROUTE',
	FAILURE_REASON_ERROR = 'FAILURE_REASON_ERROR',
	FAILURE_REASON_INCORRECT_PAYMENT_DETAILS = 'FAILURE_REASON_INCORRECT_PAYMENT_DETAILS',
	FAILURE_REASON_INSUFFICIENT_BALANCE = 'FAILURE_REASON_INSUFFICIENT_BALANCE',
	FAILURE_REASON_CANCELED = 'FAILURE_REASON_CANCELED',
}

export enum HTLCStatus {
	IN_FLIGHT = 'IN_FLIGHT',
	SUCCEEDED = 'SUCCEEDED',
	FAILED = 'FAILED',
}

export type Hop = {
	chan_id: string;
	chan_capacity: string;
	amt_to_forward: string;
	fee: string;
	expiry: number;
	amt_to_forward_msat: string;
	fee_msat: string;
	pub_key: string;
	tlv_payload: boolean;
	mpp_record?: MPPRecord;
	amp_record?: AMPRecord;
	custom_records: {[key: string]: Buffer};
	metadata: Buffer;
	blinding_point: Buffer;
	encrypted_data: Buffer;
	total_amt_msat: string;
};

export type MPPRecord = {
	payment_addr: Buffer;
	total_amt_msat: string;
};

export type AMPRecord = {
	root_share: Buffer;
	set_id: Buffer;
	child_index: number;
};

export type Route = {
	total_time_lock: number;
	total_fees: string;
	total_amt: string;
	hops: Hop[];
	total_fees_msat: string;
	total_amt_msat: string;
	first_hop_amount_msat: string;
	custom_channel_data: Buffer;
};

export type Failure = {
	code: FailureCode;
	channel_update?: ChannelUpdate;
	htlc_msat: string;
	onion_sha_256: Buffer;
	cltv_expiry: number;
	flags: number;
	failure_source_index: number;
	height: number;
};

export enum FailureCode {
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

export type ChannelUpdate = {
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

export type HTLCAttempt = {
	attempt_id: string;
	status: HTLCStatus;
	route?: Route;
	attempt_time_ns: string;
	resolve_time_ns: string;
	failure?: Failure;
	preimage: Buffer;
};

export type Payment = {
	payment_hash: string;
	value: string;
	creation_date: string;
	fee: string;
	payment_preimage: string;
	value_sat: string;
	value_msat: string;
	payment_request: string;
	status: PaymentStatus;
	fee_sat: string;
	fee_msat: string;
	creation_time_ns: string;
	settle_time_ns?: string;
	htlcs: HTLCAttempt[];
	payment_index: string;
	failure_reason: PaymentFailureReason;
	first_hop_custom_records: {[key: string]: Buffer};
};

export type ListPaymentsRequest = {
	include_incomplete?: boolean;
	index_offset?: string;
	max_payments?: string;
	reversed?: boolean;
	count_total_payments?: boolean;
	creation_date_start?: string;
	creation_date_end?: string;
};

export type LightningPayments = {
	payments: Payment[];
	first_index_offset: string;
	last_index_offset: string;
	total_num_payments: string;
};

export enum InvoiceState {
	OPEN = 'OPEN',
	SETTLED = 'SETTLED',
	CANCELED = 'CANCELED',
	ACCEPTED = 'ACCEPTED',
}

export enum InvoiceHTLCState {
	ACCEPTED = 'ACCEPTED',
	SETTLED = 'SETTLED',
	CANCELED = 'CANCELED',
}

export type HopHint = {
	node_id: string;
	chan_id: string;
	fee_base_msat: number;
	fee_proportional_millionths: number;
	cltv_expiry_delta: number;
};

export type RouteHint = {
	hop_hints: HopHint[];
};

export type InvoiceHTLC = {
	chan_id: string;
	htlc_index: string;
	amt_msat: string;
	accept_height: number;
	accept_time: string;
	resolve_time: string;
	expiry_height: number;
	state: InvoiceHTLCState;
	custom_records: {[key: string]: Buffer};
	mpp_total_amt_msat: string;
	amp?: AMP;
	custom_channel_data: Buffer;
};

export type AMP = {
	root_share: Buffer;
	set_id: Buffer;
	child_index: number;
	hash: Buffer;
	preimage: Buffer;
};

export type AMPInvoiceState = {
	state: InvoiceState;
	settle_index: string;
	settle_time: string;
	amt_paid_msat: string;
};

export type Feature = {
	name: string;
	is_required: boolean;
	is_known: boolean;
};

export type BlindedPathConfig = {
	min_num_real_hops: number;
	num_hops: number;
	max_num_paths: number;
};

export type Invoice = {
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
	route_hints: RouteHint[];
	private: boolean;
	add_index: string;
	settle_index: string;
	amt_paid: string;
	amt_paid_sat: string;
	amt_paid_msat: string;
	state: InvoiceState;
	htlcs: InvoiceHTLC[];
	features: {[key: number]: Feature};
	is_keysend: boolean;
	payment_addr: Buffer;
	is_amp: boolean;
	amp_invoice_state: {[key: string]: AMPInvoiceState};
	is_blinded: boolean;
	blinded_path_config?: BlindedPathConfig;
};

export type ListInvoicesRequest = {
	pending_only?: boolean;
	index_offset?: string;
	num_max_invoices?: number;
	reversed?: boolean;
	creation_date_start?: string;
	creation_date_end?: string;
};

export type LightningInvoices = {
	invoices: Invoice[];
	last_index_offset: string;
	first_index_offset: string;
};

export type ForwardingEvent = {
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

export type ForwardingHistoryRequest = {
	start_time?: number;
	end_time?: number;
	index_offset?: number;
	num_max_events?: number;
	peer_alias_lookup?: boolean;
	incoming_chan_ids?: string[];
	outgoing_chan_ids?: string[];
};

export type LightningForwardingHistory = {
	forwarding_events: ForwardingEvent[];
	last_offset_index: number;
};

export enum ClosureType {
	COOPERATIVE_CLOSE = 'COOPERATIVE_CLOSE',
	LOCAL_FORCE_CLOSE = 'LOCAL_FORCE_CLOSE',
	REMOTE_FORCE_CLOSE = 'REMOTE_FORCE_CLOSE',
	BREACH_CLOSE = 'BREACH_CLOSE',
	FUNDING_CANCELED = 'FUNDING_CANCELED',
	ABANDONED = 'ABANDONED',
}

export enum Initiator {
	INITIATOR_UNKNOWN = 'INITIATOR_UNKNOWN',
	INITIATOR_LOCAL = 'INITIATOR_LOCAL',
	INITIATOR_REMOTE = 'INITIATOR_REMOTE',
	INITIATOR_BOTH = 'INITIATOR_BOTH',
}

export enum ResolutionType {
	TYPE_UNKNOWN = 'TYPE_UNKNOWN',
	ANCHOR = 'ANCHOR',
	INCOMING_HTLC = 'INCOMING_HTLC',
	OUTGOING_HTLC = 'OUTGOING_HTLC',
	COMMIT = 'COMMIT',
}

export enum ResolutionOutcome {
	OUTCOME_UNKNOWN = 'OUTCOME_UNKNOWN',
	CLAIMED = 'CLAIMED',
	UNCLAIMED = 'UNCLAIMED',
	ABANDONED = 'ABANDONED',
	FIRST_STAGE = 'FIRST_STAGE',
	TIMEOUT = 'TIMEOUT',
}

export type OutPoint = {
	txid_bytes: Buffer;
	txid_str: string;
	output_index: number;
};

export type Resolution = {
	resolution_type: ResolutionType;
	outcome: ResolutionOutcome;
	outpoint: OutPoint;
	amount_sat: string;
	sweep_txid: string;
};

export type ChannelCloseSummary = {
	channel_point: string;
	chan_id: string;
	chain_hash: string;
	closing_tx_hash: string;
	remote_pubkey: string;
	capacity: string;
	close_height: number;
	settled_balance: string;
	time_locked_balance: string;
	close_type: ClosureType;
	open_initiator: Initiator;
	close_initiator: Initiator;
	resolutions: Resolution[];
	alias_scids: string[];
	zero_conf_confirmed_scid: string;
	custom_channel_data: Buffer;
};

export type ClosedChannelsRequest = {
	cooperative?: boolean;
	local_force?: boolean;
	remote_force?: boolean;
	breach?: boolean;
	funding_canceled?: boolean;
	abandoned?: boolean;
};

export type LightningClosedChannels = {
	channels: ChannelCloseSummary[];
};

export enum OutputScriptType {
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

export type OutputDetail = {
	output_type: OutputScriptType;
	address: string;
	pk_script: string;
	output_index: string;
	amount: string;
	is_our_address: boolean;
};

export type PreviousOutPoint = {
	outpoint: string;
	is_our_output: boolean;
};

export type Transaction = {
	tx_hash: string;
	amount: string;
	num_confirmations: number;
	block_hash: string;
	block_height: number;
	time_stamp: string;
	total_fees: string;
	dest_addresses: string[];
	output_details: OutputDetail[];
	raw_tx_hex: string;
	label: string;
	previous_outpoints: PreviousOutPoint[];
};

export type GetTransactionsRequest = {
	start_height?: number;
	end_height?: number;
	account?: string;
	index_offset?: number;
	max_transactions?: number;
};

export type LightningTransactionDetails = {
	transactions: Transaction[];
	last_index: string;
	first_index: string;
};

export enum CommitmentType {
	UNKNOWN_COMMITMENT_TYPE = 'UNKNOWN_COMMITMENT_TYPE',
	LEGACY = 'LEGACY',
	STATIC_REMOTE_KEY = 'STATIC_REMOTE_KEY',
	ANCHORS = 'ANCHORS',
	SCRIPT_ENFORCED_LEASE = 'SCRIPT_ENFORCED_LEASE',
	SIMPLE_TAPROOT = 'SIMPLE_TAPROOT',
	SIMPLE_TAPROOT_OVERLAY = 'SIMPLE_TAPROOT_OVERLAY',
}

export type ChannelConstraints = {
	csv_delay: number;
	chan_reserve_sat: string;
	dust_limit_sat: string;
	max_pending_amt_msat: string;
	min_htlc_msat: string;
	max_accepted_htlcs: number;
};

export type HTLC = {
	incoming: boolean;
	amount: string;
	hash_lock: Buffer;
	expiration_height: number;
	htlc_index: string;
	forwarding_channel: string;
	forwarding_htlc_index: string;
	locked_in: boolean;
};

export type Channel = {
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
	pending_htlcs: HTLC[];
	csv_delay: number;
	private: boolean;
	initiator: boolean;
	chan_status_flags: string;
	local_chan_reserve_sat: string;
	remote_chan_reserve_sat: string;
	static_remote_key: boolean;
	commitment_type: CommitmentType;
	lifetime: string;
	uptime: string;
	close_address: string;
	push_amount_sat: string;
	thaw_height: number;
	local_constraints: ChannelConstraints;
	remote_constraints: ChannelConstraints;
	alias_scids: string[];
	zero_conf: boolean;
	zero_conf_confirmed_scid: string;
	peer_alias: string;
	peer_scid_alias: string;
	memo: string;
	custom_channel_data: Buffer;
};

export type ListChannelsRequest = {
	active_only?: boolean;
	inactive_only?: boolean;
	public_only?: boolean;
	private_only?: boolean;
	peer?: Buffer;
	peer_alias_lookup?: boolean;
};

export type LightningChannels = {
	channels: Channel[];
};
