import { Config } from "./configuration.type";

export const config = (): Config => {

    const server = {
        host : process.env.SERVER_HOST || 'http://localhost',
        port : process.env.SERVER_PORT || '3321'
    };

    const config = {
        server,
    };

    return config;

}