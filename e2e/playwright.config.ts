import {defineConfig, devices, type Project} from '@playwright/test';
import {CONFIGS, type ConfigInfo} from './helpers/config';

/**
 * One project per Docker config. Stack must be running (`npm run e2e:up <config>`)
 * before `npm run e2e:test` — there's no webServer hook because each project's
 * stack is bespoke.
 *
 * Each config gets TWO Playwright projects: a `setup-<config>` that exercises
 * the auth flow once and writes storage state to `e2e/.auth/<config>.json`,
 * and the real project that depends on it and loads that state. The split
 * amortizes login across every spec — Orchard's auth throttler (~4 req/10s)
 * would otherwise trip around the 5th login per config.
 *
 * `workers: 1` per project because within-project tests share Orchard state
 * (admin user, channels, wallet balances) and races produce flakes.
 *
 * Storage state path is cwd-relative; `npm run e2e:test` always runs from
 * the repo root, so `e2e/.auth/<name>.json` lands under `e2e/.auth/` where
 * `.gitignore` already excludes it.
 */

function projectsFor(config: ConfigInfo): Project[] {
	const setupName = `setup-${config.name}`;
	const baseURL = config.orchardUrl;
	const storageState = `e2e/.auth/${config.name}.json`;
	return [
		{
			name: setupName,
			testDir: './setup',
			testMatch: /.*\.setup\.ts$/,
			use: {...devices['Desktop Chrome'], baseURL},
		},
		{
			name: config.name,
			testDir: './specs',
			testMatch: /.*\.spec\.ts$/,
			dependencies: [setupName],
			use: {...devices['Desktop Chrome'], baseURL, storageState},
		},
	];
}

export default defineConfig({
	outputDir: './test-results',
	timeout: 30_000,
	expect: {timeout: 5_000},
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 1 : 0,
	workers: 1,
	reporter: process.env.CI
		? [['list'], ['html', {open: 'never', outputFolder: './playwright-report'}]]
		: [['list']],
	use: {
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure',
	},
	projects: Object.values(CONFIGS).flatMap(projectsFor),
});
