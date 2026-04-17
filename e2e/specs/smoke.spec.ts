import {test, expect} from '@playwright/test';
import {getConfig} from '../helpers/config';
import {completeSetup} from '../helpers/setup';
import {chainHeight, mine} from '../helpers/regtest';

// Assumes a fresh stack (admin not yet created). Subsequent runs against
// the same stack will fail on completeSetup — run `e2e:down <config>` first.
test('admin setup + regtest helpers', async ({page}, testInfo) => {
	const config = getConfig(testInfo.project.name);

	await completeSetup(page, config);
	await expect(page).not.toHaveURL(/\/auth\/setup/);

	const before = chainHeight(config);
	mine(config, 3);
	const after = chainHeight(config);
	expect(after).toBe(before + 3);
});
