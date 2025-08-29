export type OracleRunOptions = {
	mode: 'date' | 'recent';
	date?: string; // YYYY-MM-DD in UTC
	recent_blocks?: number; // defaults to 144
	emit_html?: boolean; // defaults to false
};

export type OracleResult = {
	central_price: number;
	rough_price_estimate: number;
	deviation_pct: number;
	bounds: {min: number; max: number};
	block_window: {start: number; end: number};
	intraday?: Array<{block_height: number; timestamp: number; price: number}>;
	html?: string;
};
