import { Config } from "./configuration.type";

export const config = (): Config => {

    const mode = {
        production: process.env.PRODUCTION === 'true',
    };

    const server = {
        host : process.env.SERVER_HOST || 'http://localhost',
        port : process.env.SERVER_PORT || '3321',
        path : process.env.BASE_PATH || 'api',
    };

    const cashu = {
        database : process.env.MINT_DATABASE
    }

    const config = {
        server,
        mode,
        cashu
    };

    return config;

}