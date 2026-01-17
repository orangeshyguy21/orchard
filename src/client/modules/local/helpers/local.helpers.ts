export function getCurrencySymbol(unit: string): string {
	switch (unit) {
		case 'usd':
			return '$';
		case 'eur':
			return '€';
		default:
			return unit.toUpperCase();
	}
}
