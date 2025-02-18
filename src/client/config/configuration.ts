import { Config } from "./configuration.type";

const mode = {
  production: process.env["PRODUCTION"] === 'true',
};

const api = {
  proxy: (mode.production) ? '' : '/proxy',
  path: process.env["BASE_PATH"] || 'api',
};

export const environment : Config = {
  mode,
  api,
}