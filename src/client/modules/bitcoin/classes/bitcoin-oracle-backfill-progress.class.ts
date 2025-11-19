/* Shared Dependencies */
import {OrchardBitcoinOracleBackfillProgress} from '@shared/generated.types';

export class BitcoinOracleBackfillProgress implements OrchardBitcoinOracleBackfillProgress {
	public id: string;
	public status: string;
	public start_date: number | null;
	public end_date: number | null;
	public total_days: number | null;
	public processed: number | null;
	public successful: number | null;
	public failed: number | null;
	public date: number | null;
	public price: number | null;
	public success: boolean | null;
	public error: string | null;
	public oracle_stage: string | null;
	public oracle_stage_progress: number | null;
	public oracle_total_progress: number | null;
	public oracle_message: string | null;

	constructor(bobp: OrchardBitcoinOracleBackfillProgress) {
		this.id = bobp.id;
		this.status = bobp.status;
		this.start_date = bobp.start_date ?? null;
		this.end_date = bobp.end_date ?? null;
		this.total_days = bobp.total_days ?? null;
		this.processed = bobp.processed ?? null;
		this.successful = bobp.successful ?? null;
		this.failed = bobp.failed ?? null;
		this.date = bobp.date ?? null;
		this.price = bobp.price ?? null;
		this.success = bobp.success ?? null;
		this.error = bobp.error ?? null;
		this.oracle_stage = bobp.oracle_stage ?? null;
		this.oracle_stage_progress = bobp.oracle_stage_progress ?? null;
		this.oracle_total_progress = bobp.oracle_total_progress ?? null;
		this.oracle_message = bobp.oracle_message ?? null;
	}
}
