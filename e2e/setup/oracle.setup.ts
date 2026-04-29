/**
 * Per-stack oracle backfill setup. Drives the actual Backfill Prices flow on
 * `/bitcoin/oracle` so downstream `@oracle` specs find a populated price feed.
 *
 * Tagged `@oracle` so it only runs on stacks where the bitcoin oracle was
 * enabled by `settings.setup.ts` (today: cln-nutshell-postgres). On other
 * stacks the project's grep yields zero tests and the dependency completes
 * instantly.
 *
 * Two-layer skip: this setup skips with `e2e-readiness:` if mainchain isn't
 * synced enough to compute a price; downstream `@oracle` specs skip with the
 * same prefix if no oracle data is present. So a stuck IBD doesn't fail the
 * run — it just collapses everything @oracle into structured skips.
 *
 * The submit trigger is non-obvious: the form has no submit button. Filling
 * `date_start` registers a PENDING event in `EventService`, which morphs the
 * global `orc-event-general-nav-tool` to a save icon. Clicking that nav tool
 * is what fires `submitBackfill()` — same pattern `settings.setup.ts` uses
 * for app-settings commits.
 */

import {test as setup, expect, type Page} from '@playwright/test';
import {DateTime} from 'luxon';
import {mainchainSynced, requireReady, oracleHasRecentData, getReadiness} from '../helpers/readiness';

const BACKFILL_TIMEOUT_MS = 5 * 60_000;

/** Open the date_start picker and click yesterday's cell — locale-independent
 *  (won't break under es-ES or any other matrix locale). Yesterday is always
 *  reachable from today's calendar view: same month except on the 1st. */
async function pickYesterday(page: Page): Promise<void> {
	const yesterday = DateTime.utc().minus({days: 1}).startOf('day');
	const today = DateTime.utc().startOf('day');

	const form = page.locator('orc-bitcoin-subsection-oracle-form');
	await form.locator('mat-datepicker-toggle').first().click();

	if (yesterday.month !== today.month) {
		await page.locator('.mat-calendar-previous-button').click();
	}

	const cells = page.locator('.mat-calendar-body-cell-content');
	await cells
		.filter({hasText: new RegExp(`^${yesterday.day}$`)})
		.first()
		.click();
}

setup('compute yesterday oracle', {tag: '@oracle'}, async ({page}) => {
	setup.setTimeout(BACKFILL_TIMEOUT_MS + 30_000);

	await page.goto('/bitcoin/oracle', {waitUntil: 'networkidle'});
	await requireReady(page, mainchainSynced);

	const yesterday_unix = DateTime.utc().minus({days: 1}).startOf('day').toUnixInteger();
	const already_done = await getReadiness(page).then((r) => r.oracle_recent.some((p) => p.date >= yesterday_unix));
	if (already_done) return;

	const oracle = page.locator('orc-bitcoin-subsection-oracle');
	await oracle.locator('button', {has: page.locator('mat-icon', {hasText: 'history'})}).click();

	await pickYesterday(page);

	const save = page.locator('.event-nav-tool.nav-tool-highlight').first();
	await expect(save).toBeVisible();
	await save.click();

	await expect
		.poll(
			async () => {
				const r = await getReadiness(page);
				return r.oracle_recent.some((p) => p.date >= yesterday_unix);
			},
			{timeout: BACKFILL_TIMEOUT_MS, intervals: [2_000]},
		)
		.toBe(true);
});
