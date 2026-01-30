/* Application Dependencies */
import {MintUnit} from '@server/modules/cashu/cashu.enums';

export function oracleConvertToUSDCents(amount_btc: number | null, price_usd: number | null, unit: string | MintUnit): number | null {
	if (amount_btc === null) return null;
	if (price_usd === null) return null;
	const unit_lower = unit.toLowerCase();
	switch (unit_lower) {
		case 'sat':
			return Math.round((amount_btc / 100_000_000) * price_usd * 100);
		case 'msat':
			return Math.round((amount_btc / 100_000_000_000) * price_usd * 100);
		case 'btc':
			return Math.round(amount_btc * price_usd * 100);
		default:
			return null;
	}
}
