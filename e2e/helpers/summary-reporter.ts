/** Prints a "Test environments" matrix before Playwright's list reporter
 *  starts streaming, so the top of the scrollback shows what each stack
 *  is for without cross-referencing `helpers/config.ts`. */

/* Vendor Dependencies */
import type {Reporter, FullConfig, Suite} from '@playwright/test/reporter';

/* Native Dependencies */
import {CANARY, CONFIGS, bareConfigName, featuresFor, mintUnitsFor, portOf} from './config';

interface Stack {
	name: string;
	port: string;
	bitcoin: boolean;
	ln: false | 'lnd' | 'cln';
	mint: string;
	db: string;
	units: string;
	features: string[];
	count: number;
	isCanary: boolean;
}

const useColor = !process.env.NO_COLOR;
const ansi = (code: string) => (useColor ? code : '');
const DIM = ansi('\x1b[2m');
const BOLD = ansi('\x1b[1m');
const CYAN = ansi('\x1b[36m');
const YELLOW = ansi('\x1b[33m');
const GREEN = ansi('\x1b[32m');
const MAGENTA = ansi('\x1b[35m');
const RESET = ansi('\x1b[0m');

/** Visible length — strips ANSI so padding math works with colored cells. */
function vlen(s: string): number {
	// eslint-disable-next-line no-control-regex
	return s.replace(/\x1b\[[0-9;]*m/g, '').length;
}

function padRight(s: string, w: number): string {
	return s + ' '.repeat(Math.max(0, w - vlen(s)));
}

function center(s: string, w: number): string {
	const pad = Math.max(0, w - vlen(s));
	const l = Math.floor(pad / 2);
	return ' '.repeat(l) + s + ' '.repeat(pad - l);
}

export default class SummaryReporter implements Reporter {
	onBegin(_config: FullConfig, suite: Suite): void {
		const counts = new Map<string, number>();
		for (const test of suite.allTests()) {
			const projectName = test.parent.project()?.name ?? '';
			const bare = bareConfigName(projectName);
			counts.set(bare, (counts.get(bare) ?? 0) + 1);
		}

		const stacks: Stack[] = Object.values(CONFIGS)
			.map((c) => ({
				name: c.name,
				port: `:${portOf(c)}`,
				bitcoin: c.bitcoin,
				ln: c.ln,
				mint: c.mint,
				db: c.db,
				units: mintUnitsFor(c).join(' '),
				features: featuresFor(c),
				count: counts.get(c.name) ?? 0,
				isCanary: c.name === CANARY,
			}))
			.filter((s) => s.count > 0);

		if (stacks.length === 0) return;

		const labelW = '  Database'.length;
		const colW = stacks.map((s) =>
			Math.max(
				s.port.length,
				s.ln ? s.ln.length : 1,
				s.mint.length,
				s.db.length,
				s.units.length,
				...(s.features.length ? s.features.map((f) => f.length) : [1]),
				String(s.count).length,
				8,
			),
		);
		const featureRows = Math.max(1, ...stacks.map((s) => s.features.length));

		const border = (l: string, sep: string, r: string) =>
			DIM + l + '─'.repeat(labelW + 2) + sep + colW.map((w) => '─'.repeat(w + 2)).join(sep) + r + RESET;

		const row = (label: string, cells: string[]) =>
			DIM + '│' + RESET + ' ' + padRight(label, labelW) + ' ' +
			cells.map((c, i) => DIM + '│' + RESET + ' ' + center(c, colW[i]) + ' ').join('') +
			DIM + '│' + RESET;

		const total = stacks.reduce((a, s) => a + s.count, 0);
		const tableWidth = 1 + (labelW + 2) + stacks.length * 1 + colW.reduce((a, b) => a + b + 2, 0) + stacks.length;

		const lines: string[] = [''];

		const title = ' ORCHARD E2E TEST MATRIX ';
		const fillers = Math.max(0, tableWidth - title.length - 6);
		const leftFill = 3;
		const rightFill = fillers - leftFill;
		lines.push(`${DIM}${'━'.repeat(leftFill)}${RESET}${BOLD}${CYAN}${title}${RESET}${DIM}${'━'.repeat(Math.max(0, rightFill))}${RESET}`);
		lines.push('');

		lines.push(border('┌', '┬', '┐'));
		lines.push(
			row(
				'',
				stacks.map((s) => `${BOLD}${s.isCanary ? YELLOW : CYAN}${s.port}${RESET}`),
			),
		);
		lines.push(border('├', '┼', '┤'));

		lines.push(
			row(
				`${BOLD}Bitcoin${RESET}`,
				stacks.map((s) => (s.bitcoin ? 'core' : `${DIM}—${RESET}`)),
			),
		);
		lines.push(
			row(
				`${BOLD}Lightning${RESET}`,
				stacks.map((s) => (s.ln === false ? `${DIM}—${RESET}` : s.ln)),
			),
		);
		lines.push(
			row(
				`${BOLD}Mint${RESET}`,
				stacks.map((s) => s.mint),
			),
		);
		lines.push(
			row(
				`${DIM}  Database${RESET}`,
				stacks.map((s) => `${DIM}${s.db}${RESET}`),
			),
		);
		lines.push(
			row(
				`${DIM}  Units${RESET}`,
				stacks.map((s) => `${DIM}${s.units}${RESET}`),
			),
		);
		for (let i = 0; i < featureRows; i++) {
			lines.push(
				row(
					i === 0 ? `${BOLD}Features${RESET}` : '',
					stacks.map((s) => {
						if (s.features.length === 0) return i === 0 ? `${DIM}—${RESET}` : '';
						const f = s.features[i];
						return f ? `${MAGENTA}${f}${RESET}` : '';
					}),
				),
			);
		}

		lines.push(border('├', '┼', '┤'));
		lines.push(
			row(
				`${BOLD}Tests${RESET}`,
				stacks.map((s) => `${GREEN}${s.count}${RESET}`),
			),
		);
		lines.push(border('└', '┴', '┘'));

		const canaryStack = stacks.find((s) => s.isCanary);
		const canaryNote = canaryStack ? `  ${DIM}canary:${RESET} ${YELLOW}${canaryStack.port}${RESET}` : '';
		lines.push('');
		lines.push(
			`  ${DIM}Total${RESET} ${BOLD}${GREEN}${total}${RESET} ${DIM}tests across${RESET} ${BOLD}${stacks.length}${RESET} ${DIM}environments${RESET}${canaryNote}`,
		);
		lines.push('');

		process.stdout.write(lines.join('\n') + '\n');
	}
}
