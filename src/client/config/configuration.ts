import { Config } from "./configuration.type";

const mode = {
  production: extractBooleanValue(process.env["PRODUCTION"]) || false,
};

const api = {
  path: (mode.production) ? '' : '/proxy',
};

export const environment : Config = {
  mode,
  api,
}

function extractBooleanValue(env_val:string|undefined) : boolean|undefined {
  if( env_val === undefined ) return env_val;
  if( env_val === 'false' ) return false;
  if( env_val === 'true' ) return true;
  return undefined;
}