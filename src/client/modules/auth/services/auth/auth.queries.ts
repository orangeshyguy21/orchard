export const AUTHENTICATION_MUTATION = `
mutation Authentication($authentication: AuthenticationInput!) {
	authentication(authentication: $authentication) {
		access_token
		refresh_token
	}
}`;

export const REFRESH_AUTHENTICATION_MUTATION = `
mutation RefreshAuthentication {
	refresh_authentication {
		access_token
		refresh_token
	}
}`;