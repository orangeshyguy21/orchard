/**
 * Rounds a number to 2 decimal places
 */
function round(value: number): number {
	return Math.round(value * 100) / 100;
}

export function median(values: number[], whole: boolean = false): number {
	if (values.length === 0) return 0;
	values = [...values].sort((a, b) => a - b);
	const half = Math.floor(values.length / 2);
	const result = values.length % 2 ? values[half] : (values[half - 1] + values[half]) / 2;
	return whole ? Math.round(result) : round(result);
}

export function avg(values: number[], whole: boolean = false): number {
	if (values.length === 0) return 0;
	const result = values.reduce((a, b) => a + b, 0) / values.length;
	return whole ? Math.round(result) : round(result);
}

export function max(values: number[]): number {
	if (values.length === 0) return 0;
	return round(Math.max(...values));
}

export function min(values: number[]): number {
	if (values.length === 0) return 0;
	return round(Math.min(...values));
}
