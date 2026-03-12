/* Vendor Dependencies */
import {Entity, Column, PrimaryGeneratedColumn, Index} from 'typeorm';

/**
 * Stores cached hourly mint analytics metrics.
 * Each row represents one metric type for one hour.
 *
 * Unit-level metrics use keyset_id = '' (empty string).
 * Keyset-level metrics (keyset_issued, keyset_redeemed) use the actual keyset id.
 */
@Entity('analytics_mint')
@Index(['mint_pubkey', 'keyset_id', 'unit', 'metric', 'date'], {unique: true})
export class MintAnalytics {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	// Mint public key (identity)
	@Column({type: 'text'})
	mint_pubkey: string;

	// Keyset ID: empty string for unit-level metrics, populated for keyset-level metrics
	@Column({type: 'text', default: ''})
	keyset_id: string;

	// Unit: 'sat', 'msat', 'usd', 'eur', etc.
	@Column({type: 'text'})
	unit: string;

	// Metric type from MintAnalyticsMetric enum
	@Column({type: 'text'})
	metric: string;

	// Hour start timestamp (UTC, always stored in UTC)
	@Column({type: 'integer'})
	date: number;

	// Total amount in smallest unit
	@Column({type: 'bigint'})
	amount: string;

	// Count of items in this bucket (proofs, blind sigs, quotes, etc.)
	@Column({type: 'integer', default: 0})
	count: number;

	// Last time this record was updated (unix timestamp)
	@Column({type: 'integer'})
	updated_at: number;
}
