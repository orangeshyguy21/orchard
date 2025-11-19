export type UTXOracleRunOptions = {
	date?: number; // Unix timestamp in seconds (midnight UTC)
	recent_blocks?: number; // defaults to 144
	intraday?: boolean; // include intraday data in result
	progress_callback?: (progress: UTXOracleProgress) => void;
};

export type UTXOracleResult = {
	central_price: number;
	rough_price_estimate: number;
	deviation_pct: number;
	bounds: {min: number; max: number};
	block_window: {start: number; end: number};
	intraday?: Array<{block_height: number; timestamp: number; price: number}>;
};

export type UTXOracleProgress = {
	stage: 'connecting' | 'finding_start' | 'finding_end' | 'loading_transactions' | 'computing_prices';
	stage_progress: number;
	total_progress: number;
	message?: string;
};
