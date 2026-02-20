/* Core Dependencies */
import {Field, Float, Int, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class OrchardMintMonitor {
	@Field(() => Int)
	db_entries_total: number;

	@Field(() => Int)
	mint_quotes_total: number;

	@Field(() => Int)
	melt_quotes_total: number;

	@Field(() => Int)
	proof_groups_total: number;

	@Field(() => Int)
	promise_groups_total: number;

	@Field(() => Int)
	request_count_recent: number;

	@Field(() => Int)
	recent_window_hours: number;

	@Field(() => Float)
	disk_free_bytes: number;

	@Field(() => Float)
	disk_total_bytes: number;

	@Field(() => Int)
	cpu_cores: number;

	@Field(() => Float)
	cpu_load_1m: number;

	@Field(() => Float)
	cpu_load_5m: number;

	@Field(() => Float)
	cpu_load_15m: number;

	@Field(() => Float)
	cpu_usage_percent: number;

	constructor(data: OrchardMintMonitor) {
		this.db_entries_total = data.db_entries_total;
		this.mint_quotes_total = data.mint_quotes_total;
		this.melt_quotes_total = data.melt_quotes_total;
		this.proof_groups_total = data.proof_groups_total;
		this.promise_groups_total = data.promise_groups_total;
		this.request_count_recent = data.request_count_recent;
		this.recent_window_hours = data.recent_window_hours;
		this.disk_free_bytes = data.disk_free_bytes;
		this.disk_total_bytes = data.disk_total_bytes;
		this.cpu_cores = data.cpu_cores;
		this.cpu_load_1m = data.cpu_load_1m;
		this.cpu_load_5m = data.cpu_load_5m;
		this.cpu_load_15m = data.cpu_load_15m;
		this.cpu_usage_percent = data.cpu_usage_percent;
	}
}
