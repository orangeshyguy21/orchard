/* Application Dependencies */
import {LightningRequestType} from '@server/modules/lightning/lightning.enums';

export function asBigIntMsat(v: any): bigint {
	if (v == null) return BigInt(0);
	if (typeof v === 'object' && 'msat' in v) v = v.msat;
	if (typeof v === 'string') return BigInt(v);
	if (typeof v === 'number') return BigInt(Math.trunc(v));
	try {
		return BigInt(v);
	} catch {
		return BigInt(0);
	}
}

export function msatToStrings(msatLike: any): {sat: string; msat: string} {
	const msat = asBigIntMsat(msatLike);
	return {sat: (msat / BigInt(1000)).toString(), msat: msat.toString()};
}

export function sumMsat(items: any[], selector: (x: any) => any): bigint {
	let total = BigInt(0);
	for (const it of items || []) total += asBigIntMsat(selector(it));
	return total;
}

export function mapRequestExpiry(request: any): number {
	if (request?.offer_absolute_expiry) return Number(request.offer_absolute_expiry);
	if (request?.expiry) return Number(request?.created_at) + Number(request.expiry);
	return null;
}

export function mapRequestDescription(description: string | null): string | null {
	if (!description) return null;
	if (description === '') return null;
	return description;
}

export function mapRequestType(type: string): LightningRequestType {
	switch (type) {
		case 'BOLT12_OFFER':
			return LightningRequestType.BOLT12_OFFER;
		case 'BOLT12_INVOICE':
			return LightningRequestType.BOLT12_INVOICE;
		case 'BOLT12_INVOICE_REQUEST':
			return LightningRequestType.BOLT12_INVOICE_REQUEST;
		case 'BOLT11_INVOICE':
			return LightningRequestType.BOLT11_INVOICE;
		default:
			return LightningRequestType.UNKNOWN;
	}
}
