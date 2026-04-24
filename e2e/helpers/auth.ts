import {type Page, expect} from '@playwright/test';
import {TEST_ADMIN, type ConfigInfo} from './config';
import {completeSetup} from './setup';

/**
 * Ensures the page ends up authenticated as the seed admin, regardless of
 * whether the stack is fresh (run setup) or already has the admin (login).
 */
export async function loginViaUi(page: Page, config: ConfigInfo): Promise<void> {
	// `networkidle` waits for client-side routing + initial data fetches to
	// settle — necessary because `page.goto` returns before the SPA's auth
	// guard runs. `workers: 1` means specs share a browser context within a
	// project, so a prior spec may have already authed; in that case the
	// guard won't redirect and we can skip the login flow.
	await page.goto('/', {waitUntil: 'networkidle'});
	if (!/\/auth/.test(page.url())) return;

	if (/\/auth\/setup/.test(page.url())) {
		await completeSetup(page, config);
		return;
	}

	await page.getByLabel('Username').fill(TEST_ADMIN.name);
	await page.getByLabel('Password', {exact: true}).fill(TEST_ADMIN.password);
	await page.getByLabel('Password', {exact: true}).press('Enter');
	await expect(page).not.toHaveURL(/\/auth/);
}
