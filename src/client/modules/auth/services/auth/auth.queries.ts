export const AUTHENTICATION_MUTATION = `
mutation Authentication($authentication: AuthenticationInput!) {
	authentication(authentication: $authentication) {
		access_token
	}
}`;