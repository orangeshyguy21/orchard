export type OrchardAuthToken = {
    access_token: string;
    refresh_token: string;
}

export type JwtPayload = {
    sub: string;      
    username: string;
    type: 'access' | 'refresh';
}

export type RefreshTokenPayload = {
    sub: string;
    username: string;
    type: 'refresh';
}