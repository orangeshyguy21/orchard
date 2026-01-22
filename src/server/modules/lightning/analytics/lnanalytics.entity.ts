/* Vendor Dependencies */
import {Entity, Column, PrimaryGeneratedColumn, Index} from 'typeorm';

/**
 * Stores cached hourly lightning analytics metrics.
 * Each row represents one metric type for one hour.
 *
 * Metrics tracked:
 * - payments_out: outgoing payments (reduces outbound liquidity)
 * - invoices_in: incoming settled invoices (increases outbound liquidity)
 * - forward_fees: routing fees earned (increases outbound liquidity)
 * - channel_opens: initial local balance on channel open (increases outbound liquidity)
 * - channel_closes: settled balance on close (removes liquidity from pool)
 */
@Entity('analytics_lightning')
@Index(['node_pubkey', 'group_key', 'unit', 'metric', 'date'], {unique: true})
export class LightningAnalytics {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	// Lightning node public key (identity_pubkey)
	@Column({type: 'text'})
	node_pubkey: string;

	// Taproot Asset group key (null for regular lightning/BTC channels)
	@Column({type: 'text', nullable: true})
	group_key: string | null;

	// Asset unit: 'msat' for regular lightning, or taproot asset unit (e.g., 'usd')
	@Column({type: 'text', default: 'msat'})
	unit: string;

	// Metric type: payments_out, invoices_in, forward_fees, channel_opens, channel_closes
	@Column({type: 'text'})
	metric: string;

	// Hour start timestamp (UTC, always stored in UTC)
	@Column({type: 'integer'})
	date: number;

	// Total amount in smallest unit (msat for lightning, or asset-specific smallest unit)
	@Column({type: 'bigint'})
	amount: string;

	// Number of times we tried to compute this hour (for tracking problematic periods)
	@Column({type: 'integer', default: 0})
	attempts: number;

	// Last time this record was updated (unix timestamp)
	@Column({type: 'integer'})
	updated_at: number;
}
