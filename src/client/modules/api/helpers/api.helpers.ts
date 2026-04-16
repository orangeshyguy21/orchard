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
