export const AUTHENTICATION_MUTATION = `
mutation Authentication($authentication: AuthenticationInput!) {
	authentication(authentication: $authentication) {
		access_token
		refresh_token
	}
}`;

export const REFRESH_TOKEN_MUTATION = `
mutation RefreshToken {
	refreshToken {
		access_token
		refresh_token
	}
}`;