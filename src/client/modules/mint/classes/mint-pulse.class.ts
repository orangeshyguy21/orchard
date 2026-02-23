import {OrchardMintPulse, OrchardMintPulseActivity, OrchardMintPulseQuoteRate} from '@shared/generated.types';

export class MintPulseActivity {
	public mint_count: number;
	public melt_count: number;
	public swap_count: number;

	constructor(ompa: OrchardMintPulseActivity) {
		this.mint_count = ompa.mint_count;
		this.melt_count = ompa.melt_count;
		this.swap_count = ompa.swap_count;
	}
}

export class MintPulseQuoteRate {
	public total: number;
	public completed: number;

	constructor(ompqr: OrchardMintPulseQuoteRate) {
		this.total = ompqr.total;
		this.completed = ompqr.completed;
	}
}

export class MintPulse {
	public current_24h: MintPulseActivity;
	public previous_24h: MintPulseActivity;
	public mint_quote_rate: MintPulseQuoteRate;
	public melt_quote_rate: MintPulseQuoteRate;
	public last_mint_time: number | null;
	public last_melt_time: number | null;
	public last_swap_time: number | null;

	constructor(omp: OrchardMintPulse) {
		this.current_24h = new MintPulseActivity(omp.current_24h);
		this.previous_24h = new MintPulseActivity(omp.previous_24h);
		this.mint_quote_rate = new MintPulseQuoteRate(omp.mint_quote_rate);
		this.melt_quote_rate = new MintPulseQuoteRate(omp.melt_quote_rate);
		this.last_mint_time = omp.last_mint_time ?? null;
		this.last_melt_time = omp.last_melt_time ?? null;
		this.last_swap_time = omp.last_swap_time ?? null;
	}
}
