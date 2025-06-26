export type OrchardAuthToken = {
    access_token: string;
}

export type JwtPayload = {
    sub: string;      
    username: string;
}