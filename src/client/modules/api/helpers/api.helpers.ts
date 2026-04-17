/* Application Configuration */
// import {environment} from '@client/configs/configuration';

// export const api = `${environment.api.proxy}/${environment.api.path}`;

export function getApiQuery(query: string, variables?: any) {
	return {
		query: query,
		variables: variables,
	};
}

/** Derives the WebSocket scheme that matches the page protocol — `wss:` on HTTPS, `ws:` otherwise */
export function deriveWsScheme(page_protocol: string): 'ws:' | 'wss:' {
	return page_protocol === 'https:' ? 'wss:' : 'ws:';
}

/** Returns true when the graphql-ws error sink payload contains a GraphQL error with `extensions.code === code`. */
export function hasGqlWsErrorCode(error: unknown, code: number): boolean {
	if (!Array.isArray(error)) return false;
	return (error as Array<{extensions?: {code?: number}}>).some((e) => e?.extensions?.code === code);
}
