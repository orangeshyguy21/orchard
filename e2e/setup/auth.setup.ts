/**
 * Per-project auth setup. Runs once (via Playwright project `dependencies`)
 * before dependent specs — covers the first-run setup UI feature on fresh
 * stacks and persists the resulting auth state to `.auth/<config>.json` so
 * tests don't re-login per-test (which would trip the server's throttler).
 *
 * Test order matters: failure cases run first (they don't advance the
 * stack's state), then the happy-path test completes setup for real.
 * On already-initialized stacks, failure-case tests skip and the happy-path
 * test just logs in.
 */

import {test as setup, expect, type Page, type TestInfo} from '@playwright/test';
import {TEST_ADMIN, getConfig} from '../helpers/config';
import {loginViaUi} from '../helpers/auth';

const isSetupForm = (page: Page) => /\/auth\/setup/.test(page.url());

/** Setup projects are named `setup-<config>:<port>`; strip both the prefix
 *  and the decorative port suffix to recover the bare config name. */
const configNameFromProject = (testInfo: TestInfo) => testInfo.project.name.replace(/^setup-/, '').replace(/:\d+$/, '');
const configFromProject = (testInfo: TestInfo) => getConfig(configNameFromProject(testInfo));
const statePathForProject = (testInfo: TestInfo) => `e2e/.auth/${configNameFromProject(testInfo)}.json`;

async function gotoAuth(page: Page): Promise<void> {
	await page.goto('/');
	await expect(page).toHaveURL(/\/auth/);
}

setup.describe('setup form validation (fresh stacks only)', {tag: '@canary'}, () => {
	setup.beforeEach(async ({page}) => {
		await gotoAuth(page);
		setup.skip(!isSetupForm(page), 'stack already initialized');
	});

	setup('setup UI rejects wrong key', async ({page}) => {
		await page.getByLabel('Setup Key').fill('this-is-the-wrong-key');
		await page.getByLabel('Username').fill(TEST_ADMIN.name);
		await page.getByLabel('Password', {exact: true}).fill(TEST_ADMIN.password);
		await page.getByLabel('Confirm Password').fill(TEST_ADMIN.password);
		await page.getByRole('button', {name: /start/i}).click();

		// Server rejects → we stay on the setup form (no navigation).
		await expect(page).toHaveURL(/\/auth\/setup/);
	});

	setup('setup UI disables Start when password is too short', async ({page}, testInfo) => {
		const config = configFromProject(testInfo);
		await page.getByLabel('Setup Key').fill(config.setupKey);
		await page.getByLabel('Username').fill(TEST_ADMIN.name);
		await page.getByLabel('Password', {exact: true}).fill('abc');
		await page.getByLabel('Confirm Password').fill('abc');

		await expect(page.getByRole('button', {name: /start/i})).toBeDisabled();
	});

	setup('setup UI disables Start when passwords do not match', async ({page}, testInfo) => {
		const config = configFromProject(testInfo);
		await page.getByLabel('Setup Key').fill(config.setupKey);
		await page.getByLabel('Username').fill(TEST_ADMIN.name);
		await page.getByLabel('Password', {exact: true}).fill(TEST_ADMIN.password);
		await page.getByLabel('Confirm Password').fill('something-different');

		await expect(page.getByRole('button', {name: /start/i})).toBeDisabled();
	});
});

setup('authenticate + persist state', {tag: '@all'}, async ({page}, testInfo) => {
	await loginViaUi(page, configFromProject(testInfo));
	await page.context().storageState({path: statePathForProject(testInfo)});
});
