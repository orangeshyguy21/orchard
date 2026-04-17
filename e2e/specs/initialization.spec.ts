/**
 * First-run admin creation via the /auth/setup UI.
 *
 * This flow only renders on a fresh stack — the uninitializedGuard redirects
 * `/` → `/auth/setup` only when no admin exists. Run `npm run e2e:down all`
 * then `e2e:up all` to re-exercise. On already-initialized stacks the test
 * skips gracefully rather than failing.
 */

import {test, expect} from '@playwright/test';
import {getConfig} from '../helpers/config';
import {completeSetup} from '../helpers/setup';

test('first-run admin setup via UI', async ({page}, testInfo) => {
	const config = getConfig(testInfo.project.name);

	await page.goto('/');
	await expect(page).toHaveURL(/\/auth/);

	test.skip(!/\/auth\/setup/.test(page.url()), 'stack already initialized — re-up to exercise');

	await completeSetup(page, config);
	await expect(page).not.toHaveURL(/\/auth\/setup/);
});
