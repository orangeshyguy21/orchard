import { Config } from "./configuration.type";

const mode = {
  production: process.env["PRODUCTION"] === 'true',
};

const api = {
  path: (mode.production) ? '' : '/proxy',
};

export const environment : Config = {
  mode,
  api,
}