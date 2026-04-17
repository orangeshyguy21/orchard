import {type Page, expect} from '@playwright/test';
import type {ConfigInfo} from './config';

/**
 * Call once per compose-stack lifetime. The uninitializedGuard redirects
 * `/` → `/auth/setup` only when no admin exists; a second call against the
 * same stack will throw because the setup route will no longer render.
 */
export interface AdminCreds {
	username: string;
	password: string;
}

export const DEFAULT_ADMIN: AdminCreds = {
	username: 'admin',
	password: 'orchard-e2e-admin-pw',
};

export async function completeSetup(page: Page, config: ConfigInfo, creds: AdminCreds = DEFAULT_ADMIN): Promise<void> {
	await page.goto('/');
	await expect(page).toHaveURL(/\/auth\/setup$/);

	await page.getByLabel('Setup Key').fill(config.setupKey);
	await page.getByLabel('Username').fill(creds.username);
	await page.getByLabel('Password', {exact: true}).fill(creds.password);
	await page.getByLabel('Confirm Password').fill(creds.password);

	await page.getByRole('button', {name: /start/i}).click();
	await expect(page).not.toHaveURL(/\/auth\/setup/);
}
