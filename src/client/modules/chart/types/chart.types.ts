export interface OracleChartDataPoint {
	x: number;
	y: number;
	y_original: number;
	y_converted: number | null;
	unit: string;
}
