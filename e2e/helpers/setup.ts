import {type Page, expect} from '@playwright/test';
import {TEST_ADMIN, type ConfigInfo} from './config';

/**
 * Call once per compose-stack lifetime. The uninitializedGuard redirects
 * `/` → `/auth/setup` only when no admin exists; a second call against the
 * same stack will throw because the setup route will no longer render.
 */
export async function completeSetup(page: Page, config: ConfigInfo): Promise<void> {
	await page.goto('/');
	await expect(page).toHaveURL(/\/auth\/setup$/);

	await page.getByLabel('Setup Key').fill(config.setupKey);
	await page.getByLabel('Username').fill(TEST_ADMIN.name);
	await page.getByLabel('Password', {exact: true}).fill(TEST_ADMIN.password);
	await page.getByLabel('Confirm Password').fill(TEST_ADMIN.password);

	await page.getByRole('button', {name: /start/i}).click();
	await expect(page).not.toHaveURL(/\/auth\/setup/);
}
