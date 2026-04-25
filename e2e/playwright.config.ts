import {defineConfig, devices, type Project} from '@playwright/test';
import {CONFIGS, portOf, tagsFor, type ConfigInfo} from './helpers/config';

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
 *
 * ## Tag-based scoping
 *
 * Specs declare which stacks a test is relevant to via tags. Each real
 * project's `grep` is computed from its `ConfigInfo` — a test runs on a
 * stack only if one of its tags matches the stack's grep.
 *
 * Tag vocabulary:
 *
 *   @canary              — config-agnostic; runs only on the canary stack
 *                          (lnd-nutshell-sqlite). Most feature specs are @canary.
 *   @lightning           — app-state: LIGHTNING_TYPE wired; runs on stacks
 *                          with a real LN backend (config.ln !== false)
 *   @no-lightning        — app-state: Orchard booted without LIGHTNING_TYPE;
 *                          runs on fake-cdk-postgres only
 *   @no-bitcoin          — app-state: Orchard booted without BITCOIN_TYPE;
 *                          runs on fake-cdk-postgres only
 *   @lnd / @cln          — LN impl-name tags; runs on stacks with matching ln.
 *                          Reserve for impl-specific behavior — most specs
 *                          want @lightning / @no-lightning instead.
 *   @cdk / @nutshell     — mint-impl-sensitive; runs on stacks with matching mint
 *   @sqlite / @postgres  — DB-sensitive; runs on stacks with matching db
 *   @tapd                — requires tapd; runs only on lnd-cdk-sqlite
 *   @bolt12              — requires bolt12-capable mint + LN; runs only on
 *                          cln-cdk-postgres
 *   @mainchain           — requires a real mainnet bitcoind wired into Orchard
 *                          (oracle, mempool, block-tip, chain-sync code).
 *                          Runs only on cln-nutshell-postgres (the only stack
 *                          that ships `compose.mainchain.yml`, which is always
 *                          loaded when present).
 *   @all                 — genuine matrix coverage; runs on every stack
 *
 * Untagged tests match no project's grep → they don't run. If you see a new
 * spec silently skipping, it probably needs a `{tag: '@canary'}` annotation
 * on the test (or describe).
 *
 * Setup projects use the same grep as their real project, so auth-flow
 * tests are tag-scoped too. The happy-path `authenticate + persist state`
 * test is tagged `@all` so it runs on every stack; the fresh-stack
 * validation cases are tagged `@canary` so they only run on canary.
 */

function grepFor(config: ConfigInfo): RegExp {
	return new RegExp(tagsFor(config).map((t) => `(${t})`).join('|'));
}

function projectsFor(config: ConfigInfo): Project[] {
	const projectName = `${config.name}:${portOf(config)}`;
	const setupName = `setup-${projectName}`;
	const baseURL = config.orchardUrl;
	const storageState = `e2e/.auth/${config.name}.json`;
	return [
		{
			name: setupName,
			testDir: './setup',
			testMatch: /.*\.setup\.ts$/,
			grep: grepFor(config),
			use: {...devices['Desktop Chrome'], baseURL},
		},
		{
			name: projectName,
			testDir: './specs',
			testMatch: /.*\.spec\.ts$/,
			dependencies: [setupName],
			grep: grepFor(config),
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
		? [['./helpers/summary-reporter.ts'], ['list'], ['html', {open: 'never', outputFolder: './playwright-report'}]]
		: [['./helpers/summary-reporter.ts'], ['list']],
	use: {
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure',
	},
	projects: Object.values(CONFIGS).flatMap(projectsFor),
});
