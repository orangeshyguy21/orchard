/**
 * Minimal GraphQL client against the live Dockerized Orchard server. `token`
 * authenticates via `Authorization: Bearer` for HTTP or `connectionParams.authorization`
 * for graphql-ws subscriptions — matches Orchard's AuthenticationGuard.
 */

/* Vendor Dependencies */
import {createClient, type Client} from 'graphql-ws';

/* Native Dependencies */
import {graphqlUrl, graphqlWsUrl} from './context';

export interface GraphQLError {
	message: string;
	extensions?: Record<string, unknown>;
	path?: (string | number)[];
}

export class GqlError extends Error {
	constructor(public readonly errors: GraphQLError[], query: string) {
		const first = errors[0]?.message ?? 'Unknown GraphQL error';
		const op = query.match(/(query|mutation|subscription)\s+(\w+)/)?.[2] ?? 'anonymous';
		super(`GraphQL error on ${op}: ${first}`);
		this.name = 'GqlError';
	}
}

export async function gql<T = unknown>(query: string, variables: Record<string, unknown> = {}, token?: string): Promise<T> {
	const headers: Record<string, string> = {'content-type': 'application/json'};
	if (token) headers.authorization = `Bearer ${token}`;

	const res = await fetch(graphqlUrl(), {
		method: 'POST',
		headers,
		body: JSON.stringify({query, variables}),
	});

	if (!res.ok) {
		throw new Error(`GraphQL HTTP ${res.status}: ${await res.text()}`);
	}

	const body = (await res.json()) as {data?: T; errors?: GraphQLError[]};
	if (body.errors?.length) throw new GqlError(body.errors, query);
	return body.data as T;
}

/**
 * Returns an async iterator of subscription payloads + a `dispose()` method.
 * Specs must `await dispose()` in cleanup to close the underlying WebSocket.
 */
export function gqlSubscribe<T = unknown>(query: string, variables: Record<string, unknown> = {}, token?: string) {
	const client: Client = createClient({
		url: graphqlWsUrl(),
		connectionParams: token ? {authorization: `Bearer ${token}`} : {},
		webSocketImpl: WebSocket,
	});

	const queue: T[] = [];
	const waiters: ((value: IteratorResult<T>) => void)[] = [];
	let done = false;
	let error: Error | null = null;

	const unsubscribe = client.subscribe<T>(
		{query, variables},
		{
			next: (msg) => {
				const data = (msg.data ?? null) as T;
				if (waiters.length) waiters.shift()!({value: data, done: false});
				else queue.push(data);
			},
			error: (err) => {
				error = err instanceof Error ? err : new Error(String(err));
				while (waiters.length) waiters.shift()!({value: undefined as unknown as T, done: true});
			},
			complete: () => {
				done = true;
				while (waiters.length) waiters.shift()!({value: undefined as unknown as T, done: true});
			},
		},
	);

	const iterator: AsyncIterableIterator<T> = {
		next: () =>
			new Promise((resolve, reject) => {
				if (error) return reject(error);
				if (queue.length) return resolve({value: queue.shift()!, done: false});
				if (done) return resolve({value: undefined as unknown as T, done: true});
				waiters.push(resolve);
			}),
		return: async () => {
			unsubscribe();
			return {value: undefined as unknown as T, done: true};
		},
		[Symbol.asyncIterator]() {
			return this;
		},
	};

	return Object.assign(iterator, {
		async dispose() {
			unsubscribe();
			await client.dispose();
		},
	});
}
