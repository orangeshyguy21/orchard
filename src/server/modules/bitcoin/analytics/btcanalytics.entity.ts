/* Vendor Dependencies */
import {Entity, Column, PrimaryGeneratedColumn, Index} from 'typeorm';

/**
 * Stores cached hourly bitcoin on-chain analytics metrics.
 * Each row represents one metric type for one hour.
 *
 * Metrics tracked:
 * - payments_in: on-chain receives (deposits, channel close settlements, swept funds)
 * - payments_out: on-chain sends (withdrawals, channel open funding txs)
 * - fees: on-chain transaction fees paid
 *
 * Supports both BTC (from LND/CLN wallet) and Taproot Assets (from tapd).
 */
@Entity('analytics_bitcoin')
@Index(['node_pubkey', 'group_key', 'unit', 'metric', 'date'], {unique: true})
export class BitcoinAnalytics {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	// Lightning node public key (empty string if not from a LN node wallet)
	@Column({type: 'text', default: ''})
	node_pubkey: string;

	// Taproot Asset group key (empty string for regular BTC transactions)
	@Column({type: 'text', default: ''})
	group_key: string;

	// Unit: 'sat' for BTC, or taproot asset unit (e.g., 'usd')
	@Column({type: 'text', default: 'sat'})
	unit: string;

	// Metric type: payments_in, payments_out, fees
	@Column({type: 'text'})
	metric: string;

	// Hour start timestamp (UTC, always stored in UTC)
	@Column({type: 'integer'})
	date: number;

	// Total amount in smallest unit (sats for BTC, or asset-specific smallest unit)
	@Column({type: 'bigint'})
	amount: string;

	// Count of transactions in this bucket
	@Column({type: 'integer', default: 0})
	count: number;

	// Last time this record was updated (unix timestamp)
	@Column({type: 'integer'})
	updated_at: number;
}
