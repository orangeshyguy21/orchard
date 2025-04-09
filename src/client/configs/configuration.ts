import { Config } from "./configuration.type";

const mode = {
	production: process.env["PRODUCTION"] === 'true',
	version: process.env["npm_package_version"] || '0.0.1',
};

const api = {
	proxy: (mode.production) ? '' : '/proxy',
	path: process.env["BASE_PATH"] || 'api',
};

const ai = {
	api: process.env["AI_API"],
};

export const environment : Config = {
	mode,
	api,
	ai,
}