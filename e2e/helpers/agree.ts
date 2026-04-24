/**
 * Differential assertion — labeled deep-equal between Orchard's GraphQL response
 * and the source-of-truth backend. Framework-agnostic (works in Jest + Playwright)
 * by using Node's structural equality, not `expect`.
 *
 * Unit conversions (sat↔msat, bigint↔number) are caller-side: explicit at the
 * call site reads clearer than a DSL.
 */

/* Core Dependencies */
import {isDeepStrictEqual, inspect} from 'util';

export function agree(label: string, orchardValue: unknown, backendValue: unknown): void {
	if (isDeepStrictEqual(orchardValue, backendValue)) return;
	const orchardStr = inspect(orchardValue, {depth: null, colors: false});
	const backendStr = inspect(backendValue, {depth: null, colors: false});
	throw new Error(`Fidelity mismatch on "${label}":\n  orchard: ${orchardStr}\n  backend: ${backendStr}`);
}

export function expectAgree(pairs: Array<[label: string, orchard: unknown, backend: unknown]>): void {
	for (const [label, orchardValue, backendValue] of pairs) {
		agree(label, orchardValue, backendValue);
	}
}

/**
 * Shortcut for the common "pick N fields by name from both sides and differential"
 * pattern. Field names must match on both objects — the typical case when the
 * backend RPC is the direct source of Orchard's response.
 */
export function expectAllFieldsAgree<T extends Record<string, unknown>>(
	label: string,
	orchard: T,
	backend: Record<string, unknown>,
	fields: readonly (keyof T & string)[],
): void {
	expectAgree(fields.map((field) => [`${label}.${field}`, orchard[field], backend[field]]));
}
