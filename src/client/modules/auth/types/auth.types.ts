import {OrchardAuthentication, OrchardInitialization} from '@shared/generated.types';

export type InitializationResponse = {
	initialization: OrchardInitialization;
};

export type InitializeResponse = {
	initialize: OrchardAuthentication;
};

export type AuthenticationResponse = {
	authentication: OrchardAuthentication;
};

export type RefreshAuthenticationResponse = {
	refresh_authentication: OrchardAuthentication;
};

export type RevokeAuthenticationResponse = {
	revoke_authentication: boolean;
};
