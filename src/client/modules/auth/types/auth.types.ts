import { OrchardAuthentication } from "@shared/generated.types";

export type AuthenticationResponse = {
    authentication: OrchardAuthentication;
}

export type RefreshAuthenticationResponse = {
    refresh_authentication: OrchardAuthentication;
}