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
