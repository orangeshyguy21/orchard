/**
 * Active config for one jest run, selected via `E2E_CONFIG` (default
 * `lnd-nutshell-sqlite` — the PR-gate config). Stack must already be up.
 */

/* Application Dependencies */
import {getConfig} from '../../helpers/config';
import type {ConfigInfo} from '../../types/config';

const DEFAULT_CONFIG = 'lnd-nutshell-sqlite';

let active: ConfigInfo | null = null;

export function getActiveConfig(): ConfigInfo {
	if (!active) {
		const name = process.env.E2E_CONFIG || DEFAULT_CONFIG;
		active = getConfig(name);
	}
	return active;
}

export function graphqlUrl(): string {
	return `${getActiveConfig().orchardUrl}/api`;
}

export function graphqlWsUrl(): string {
	return graphqlUrl().replace(/^http/, 'ws');
}
