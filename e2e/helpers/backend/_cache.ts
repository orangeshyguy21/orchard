/**
 * Worker-process memoization for idempotent backend reads. Regtest fixtures
 * don't mutate mid-run for most reads (chain tip, channel topology, mint
 * info), so cache-once-per-process is safe. Reads that DO mutate mid-run
 * (mint balances, fees, ln local balance, oracle price) bypass this and
 * call docker exec / docker cp every time.
 */

const _cache = new Map<string, unknown>();

/** Memoize an idempotent backend read. Key is the only knob; pass enough
 *  identity (config name + args) to disambiguate. */
export function cached<T>(key: string, getter: () => T): T {
	if (_cache.has(key)) return _cache.get(key) as T;
	const v = getter();
	_cache.set(key, v);
	return v;
}
