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
	public date_progress: number | null;
	public overall_progress: number | null;
	public message: string | null;

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
		this.date_progress = bobp.date_progress ?? null;
		this.overall_progress = bobp.overall_progress ?? null;
		this.message = bobp.message ?? null;
	}
}
