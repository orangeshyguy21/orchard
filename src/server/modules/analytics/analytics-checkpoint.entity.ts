/* Vendor Dependencies */
import {Entity, Column, PrimaryColumn} from 'typeorm';

/**
 * Generic analytics checkpoint entity for tracking backfill progress.
 * Reusable by multiple modules (lightning, mint, etc.)
 *
 * Each row tracks the last processed index for a specific data type
 * within a module/scope combination.
 */
@Entity('analytics_checkpoint')
export class AnalyticsCheckpoint {
	// Module identifier: 'lightning' | 'mint' | etc.
	@PrimaryColumn({type: 'text'})
	module: string;

	// Scope identifier: node_pubkey for lightning, mint_id for mint
	@PrimaryColumn({type: 'text'})
	scope: string;

	// Data type: 'payments' | 'invoices' | 'forwards' | 'tokens' etc.
	@PrimaryColumn({type: 'text'})
	data_type: string;

	// Last processed offset/index
	@Column({type: 'integer', default: 0})
	last_index: number;

	// For timestamp-based pagination (optional)
	@Column({type: 'integer', nullable: true})
	last_timestamp: number | null;

	// Last time this checkpoint was updated (unix timestamp)
	@Column({type: 'integer'})
	updated_at: number;
}
