import {OrchardAuthentication, OrchardInitialization} from '@shared/generated.types';

export type InitializationResponse = {
	auth_initialization: OrchardInitialization;
};

export type InitializeResponse = {
	auth_initialize: OrchardAuthentication;
};

export type AuthenticationResponse = {
	auth_authentication: OrchardAuthentication;
};

export type SignupResponse = {
	auth_signup: OrchardAuthentication;
};

export type RefreshAuthenticationResponse = {
	auth_authentication_refresh: OrchardAuthentication;
};

export type RevokeAuthenticationResponse = {
	auth_authentication_revoke: boolean;
};
