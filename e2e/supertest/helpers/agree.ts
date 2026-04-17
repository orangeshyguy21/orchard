/**
 * Differential assertion — labeled deep-equal between Orchard's GraphQL response
 * and the source-of-truth backend. Unit conversions (sat↔msat, bigint↔number)
 * are caller-side: explicit at the call site reads clearer than a DSL.
 */

export function agree(label: string, orchardValue: unknown, backendValue: unknown): void {
	try {
		expect(orchardValue).toEqual(backendValue);
	} catch (err) {
		const msg = err instanceof Error ? err.message : String(err);
		throw new Error(`Fidelity mismatch on "${label}":\n${msg}`);
	}
}

export function expectAgree(pairs: Array<[label: string, orchard: unknown, backend: unknown]>): void {
	for (const [label, orchardValue, backendValue] of pairs) {
		agree(label, orchardValue, backendValue);
	}
}
