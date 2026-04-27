import {defineConfig, devices, type Project, type ReporterDescription} from '@playwright/test';
import {CONFIGS, portOf, tagsFor, type ConfigInfo} from './helpers/config';

/**
 * One project per Docker config. Stack must be running (`npm run e2e:up <config>`)
 * before `npm run e2e:test` — there's no webServer hook because each project's
 * stack is bespoke.
 *
 * Each config gets THREE Playwright projects, chained via `dependencies`:
 *   1. `setup-<config>`     — runs `auth.setup.ts`, writes initial storage
 *                             state to `e2e/.auth/<config>.json`.
 *   2. `settings-<config>`  — depends on (1), loads that storage state, runs
 *                             `settings.setup.ts` to apply the per-stack
 *                             settings matrix via the `/settings/app` and
 *                             `/settings/device` UIs, and writes the now-
 *                             populated state back to the same file.
 *   3. `<config>`           — depends on (2), loads the settings-augmented
 *                             state, runs the actual specs.
 * The auth split amortizes login across every spec — Orchard's auth throttler
 * (~4 req/10s) would otherwise trip around the 5th login per config. The
 * settings split keeps the operator-driven settings UI exercised once per
 * stack lifetime instead of per-spec, and bakes its results into storageState
 * so specs continue to start in a fully-configured Orchard.
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
 *   @bitcoin             — app-state: BITCOIN_TYPE wired; runs on stacks with
 *                          a real bitcoind backend (config.bitcoin === true).
 *                          Use for UI gated on the bitcoin tile mounting,
 *                          where @lightning would over-include or @canary
 *                          would under-include.
 *   @no-bitcoin          — app-state: Orchard booted without BITCOIN_TYPE;
 *                          runs on fake-cdk-postgres only
 *   @mint                — app-state: a mint backend (cdk or nutshell) is
 *                          wired up. Every shipped stack has one today, so
 *                          this currently matches `@all` — it exists so
 *                          mint-feature specs read honestly and can be
 *                          grepped on their own (`--grep @mint`).
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
 *   @ai                  — config-state: settings setup turned `ai.enabled`
 *                          on for this stack (cln-cdk-postgres only). Use
 *                          for specs that need a live AI integration.
 *   @oracle              — config-state: settings setup turned the bitcoin
 *                          oracle on for this stack (cln-nutshell-postgres
 *                          only — pairs with @mainchain). Use for specs that
 *                          need a populated price feed.
 *   @all                 — genuine matrix coverage; runs on every stack
 *
 * Untagged tests match no project's grep → they don't run. If you see a new
 * spec silently skipping, it probably needs a `{tag: '@canary'}` annotation
 * on the test (or describe).
 *
 * Setup projects use the same grep as their real project, so auth-flow
 * tests are tag-scoped too. The happy-path `authenticate + persist state`
 * test is tagged `@all` so it runs on every stack; the fresh-stack
 * validation cases are tagged `@canary` so they only run on canary. The
 * `settings.setup.ts` test is tagged `@all` for the same reason — it runs
 * on every stack, even canary (where it's a fast no-op since canary's
 * matrix leaves all settings unset).
 */

function grepFor(config: ConfigInfo): RegExp {
	return new RegExp(tagsFor(config).map((t) => `(${t})`).join('|'));
}

/** Reporter set is base + opt-in JSON (parallel runner sets the file path
 *  per-child to aggregate) + opt-in HTML on CI. */
function buildReporters(): ReporterDescription[] {
	const r: ReporterDescription[] = [['./helpers/summary-reporter.ts'], ['list']];
	if (process.env.PLAYWRIGHT_JSON_OUTPUT_FILE) {
		r.push(['json', {outputFile: process.env.PLAYWRIGHT_JSON_OUTPUT_FILE}]);
	}
	if (process.env.CI) {
		r.push(['html', {open: 'never', outputFolder: process.env.PLAYWRIGHT_HTML_REPORT_DIR || './e2e/playwright-report'}]);
	}
	return r;
}

function projectsFor(config: ConfigInfo): Project[] {
	const projectName = `${config.name}:${portOf(config)}`;
	const setupName = `setup-${projectName}`;
	const settingsName = `settings-${projectName}`;
	const baseURL = config.orchardUrl;
	const storageState = `e2e/.auth/${config.name}.json`;
	return [
		{
			name: setupName,
			testDir: './setup',
			testMatch: /auth\.setup\.ts$/,
			grep: grepFor(config),
			use: {...devices['Desktop Chrome'], baseURL},
		},
		{
			name: settingsName,
			testDir: './setup',
			testMatch: /settings\.setup\.ts$/,
			dependencies: [setupName],
			grep: grepFor(config),
			use: {...devices['Desktop Chrome'], baseURL, storageState},
		},
		{
			name: projectName,
			testDir: './specs',
			testMatch: /.*\.spec\.ts$/,
			dependencies: [settingsName],
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
	reporter: buildReporters(),
	use: {
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure',
	},
	projects: Object.values(CONFIGS).flatMap(projectsFor),
});
