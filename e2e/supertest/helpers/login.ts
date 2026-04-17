/**
 * Programmatic admin login. Uses the real JWT path (no DEV_AUTH_BYPASS) so
 * every spec exercises auth as a side effect. Tokens memoized per jest process.
 */

/* Native Dependencies */
import {gql} from './gql';
import {getActiveConfig} from './context';

/* Application Dependencies */
import {TEST_ADMIN} from '../../helpers/config';

export interface AuthTokens {
	access_token: string;
	refresh_token: string;
}

let tokens: AuthTokens | null = null;

async function isInitialized(): Promise<boolean> {
	const data = await gql<{auth_initialization: {initialization: boolean}}>(`
		query { auth_initialization { initialization } }
	`);
	return data.auth_initialization.initialization;
}

async function ensureInitialized(): Promise<void> {
	if (await isInitialized()) return;
	const {setupKey} = getActiveConfig();
	await gql(
		`mutation Init($initialize: InitializationInput!) {
			auth_initialize(initialize: $initialize) { access_token refresh_token }
		}`,
		{initialize: {key: setupKey, name: TEST_ADMIN.name, password: TEST_ADMIN.password}},
	);
}

export async function loginAsAdmin(): Promise<AuthTokens> {
	if (tokens) return tokens;
	await ensureInitialized();
	const data = await gql<{auth_authentication: AuthTokens}>(
		`mutation Auth($authentication: AuthenticationInput!) {
			auth_authentication(authentication: $authentication) { access_token refresh_token }
		}`,
		{authentication: {name: TEST_ADMIN.name, password: TEST_ADMIN.password}},
	);
	tokens = data.auth_authentication;
	return tokens;
}

/** Force re-login on next call. Use in specs that revoke the current token. */
export function resetLogin(): void {
	tokens = null;
}
