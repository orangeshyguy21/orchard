/** Prints a "Test environments" table before Playwright's list reporter
 *  starts streaming, so the top of the scrollback shows what each stack
 *  is for without cross-referencing `helpers/config.ts`. */

/* Vendor Dependencies */
import type {Reporter, FullConfig, Suite} from '@playwright/test/reporter';

/* Native Dependencies */
import {CANARY, CONFIGS, portOf, tagsFor, type ConfigInfo} from './config';

interface Row {
	name: string;
	port: string;
	ln: string;
	mint: string;
	db: string;
	flags: string;
	count: number;
	tags: string;
}

function flagsFor(config: ConfigInfo): string {
	const flags: string[] = [];
	if (config.name === CANARY) flags.push('canary');
	if (config.tapd) flags.push('tapd');
	if (config.bolt12) flags.push('bolt12');
	if (config.mainchain) flags.push(process.env.E2E_MAINCHAIN === '1' ? 'mainchain' : 'mainchain(off)');
	return flags.join(' ');
}

function bareConfigName(projectName: string): string {
	return projectName.replace(/^setup-/, '').replace(/:\d+$/, '');
}

export default class SummaryReporter implements Reporter {
	onBegin(_config: FullConfig, suite: Suite): void {
		const counts = new Map<string, number>();
		for (const test of suite.allTests()) {
			const projectName = test.parent.project()?.name ?? '';
			const bare = bareConfigName(projectName);
			counts.set(bare, (counts.get(bare) ?? 0) + 1);
		}

		const rows: Row[] = Object.values(CONFIGS)
			.map((c) => ({
				name: c.name,
				port: portOf(c),
				ln: c.ln,
				mint: c.mint,
				db: c.db,
				flags: flagsFor(c),
				count: counts.get(c.name) ?? 0,
				tags: tagsFor(c).sort().join(' '),
			}))
			.filter((r) => r.count > 0);

		if (rows.length === 0) return;

		const w = {
			name: Math.max(4, ...rows.map((r) => r.name.length)),
			port: Math.max(5, ...rows.map((r) => r.port.length + 1)),
			ln: Math.max(2, ...rows.map((r) => r.ln.length)),
			mint: Math.max(4, ...rows.map((r) => r.mint.length)),
			db: Math.max(2, ...rows.map((r) => r.db.length)),
			flags: Math.max(5, ...rows.map((r) => r.flags.length)),
			count: Math.max(5, ...rows.map((r) => `${r.count} tests`.length)),
		};

		const lines: string[] = [''];
		lines.push('Test environments');
		for (const r of rows) {
			lines.push(
				[
					'  ',
					r.name.padEnd(w.name),
					`:${r.port}`.padEnd(w.port),
					r.ln.padEnd(w.ln),
					r.mint.padEnd(w.mint),
					r.db.padEnd(w.db),
					r.flags.padEnd(w.flags),
					`${r.count} tests`.padStart(w.count),
					r.tags,
				].join('  '),
			);
		}
		lines.push('');

		process.stdout.write(lines.join('\n') + '\n');
	}
}
