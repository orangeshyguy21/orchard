export const INITIALIZATION_QUERY = `
query AuthInitialization {
	auth_initialization {
		initialization
	}
}`;

export const INITIALIZE_MUTATION = `
mutation AuthInitialize($initialize: InitializationInput!) {
	auth_initialize(initialize: $initialize) {
		access_token
		refresh_token
	}
}`;

export const AUTHENTICATION_MUTATION = `
mutation AuthAuthentication($authentication: AuthenticationInput!) {
	auth_authentication(authentication: $authentication) {
		access_token
		refresh_token
	}
}`;

export const REFRESH_AUTHENTICATION_MUTATION = `
mutation AuthAuthenticationRefresh {
	auth_authentication_refresh {
		access_token
		refresh_token
	}
}`;

export const REVOKE_AUTHENTICATION_MUTATION = `
mutation AuthAuthenticationRevoke {
	auth_authentication_revoke
}`;
