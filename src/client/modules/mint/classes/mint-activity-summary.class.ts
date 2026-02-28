import {OrchardMintActivitySummary, OrchardMintActivityBucket} from '@shared/generated.types';

export class MintActivityBucket implements OrchardMintActivityBucket {
	public created_time: number;
	public amount: number;

	constructor(bucket: OrchardMintActivityBucket) {
		this.created_time = bucket.created_time;
		this.amount = bucket.amount;
	}
}

export class MintActivitySummary implements OrchardMintActivitySummary {
	public total_operations: number;
	public total_operations_delta: number;
	public total_volume: number;
	public total_volume_delta: number;
	public mint_count: number;
	public mint_count_delta: number;
	public mint_sparkline: MintActivityBucket[];
	public melt_count: number;
	public melt_count_delta: number;
	public melt_sparkline: MintActivityBucket[];
	public swap_count: number;
	public swap_count_delta: number;
	public swap_sparkline: MintActivityBucket[];
	public mint_completed_pct: number;
	public mint_completed_pct_delta: number;
	public mint_avg_time: number;
	public mint_avg_time_delta: number;
	public melt_completed_pct: number;
	public melt_completed_pct_delta: number;
	public melt_avg_time: number;
	public melt_avg_time_delta: number;
	public warnings: string[];

	constructor(data: OrchardMintActivitySummary) {
		this.total_operations = data.total_operations;
		this.total_operations_delta = data.total_operations_delta;
		this.total_volume = data.total_volume;
		this.total_volume_delta = data.total_volume_delta;
		this.mint_count = data.mint_count;
		this.mint_count_delta = data.mint_count_delta;
		this.mint_sparkline = data.mint_sparkline.map((b) => new MintActivityBucket(b));
		this.melt_count = data.melt_count;
		this.melt_count_delta = data.melt_count_delta;
		this.melt_sparkline = data.melt_sparkline.map((b) => new MintActivityBucket(b));
		this.swap_count = data.swap_count;
		this.swap_count_delta = data.swap_count_delta;
		this.swap_sparkline = data.swap_sparkline.map((b) => new MintActivityBucket(b));
		this.mint_completed_pct = data.mint_completed_pct;
		this.mint_completed_pct_delta = data.mint_completed_pct_delta;
		this.mint_avg_time = data.mint_avg_time;
		this.mint_avg_time_delta = data.mint_avg_time_delta;
		this.melt_completed_pct = data.melt_completed_pct;
		this.melt_completed_pct_delta = data.melt_completed_pct_delta;
		this.melt_avg_time = data.melt_avg_time;
		this.melt_avg_time_delta = data.melt_avg_time_delta;
		this.warnings = data.warnings;
	}
}
