import {defineConfig, devices} from '@playwright/test';

/**
 * One project per Docker config. Stack must be running (`npm run e2e:up <config>`)
 * before `npm run e2e:test <config>` — there's no webServer hook because each
 * project's stack is bespoke.
 *
 * Scope: UI-only flows. Backend/API coverage lives in the Jest + supertest
 * tier (`test:server:e2e`).
 *
 * `workers: 1` per project because within-project tests share Orchard state
 * (admin user, channels, wallet balances) and races produce flakes.
 */

export default defineConfig({
	testDir: './specs',
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
	projects: [
		{
			name: 'lnd-nutshell-sqlite',
			use: {...devices['Desktop Chrome'], baseURL: 'http://localhost:3321'},
		},
		{
			name: 'lnd-cdk-sqlite',
			use: {...devices['Desktop Chrome'], baseURL: 'http://localhost:3323'},
		},
		{
			name: 'cln-cdk-postgres',
			use: {...devices['Desktop Chrome'], baseURL: 'http://localhost:3322'},
		},
		{
			name: 'cln-nutshell-postgres',
			use: {...devices['Desktop Chrome'], baseURL: 'http://localhost:3324'},
		},
	],
});
