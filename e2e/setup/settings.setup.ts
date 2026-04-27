/**
 * Per-project settings setup. Runs after `auth.setup.ts` and before specs —
 * drives `/settings/app` and `/settings/device` to apply the per-stack matrix
 * declared on each config, then persists the augmented state back into the
 * same `e2e/.auth/<config>.json` storage file. Tagged `@all` so canary runs
 * it too (a fast no-op there since canary leaves all settings unset).
 */

import {test as setup} from '@playwright/test';
import {applySettings} from '../helpers/settings';
import {projectConfig, projectStatePath} from '../helpers/setup';

setup('apply app + device settings', {tag: '@all'}, async ({page}, testInfo) => {
	await applySettings(page, projectConfig(testInfo, 'settings'));
	await page.context().storageState({path: projectStatePath(testInfo, 'settings')});
});
