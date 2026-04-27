/**
 * Parallel e2e runner — spawns one Playwright process per stack config so
 * each runs against an isolated docker stack. Within-project state collisions
 * (admin user, channels, balances) are still serialized inside each child;
 * across-project parallelism is real and bounds total wall time at the
 * longest-running stack instead of the sum.
 *
 * Lifecycle:
 *  1. `playwright test --list --reporter=json` runs once to count tests per
 *     project — needed for the matrix banner.
 *  2. `printMatrix` renders the banner once from this parent process.
 *  3. One `playwright test --project <name>:<port>` child is spawned per
 *     stack with `ORCHARD_E2E_PARALLEL=1` set, which tells the per-project
 *     SummaryReporter to skip its own banner.
 *  4. Each child's stdout/stderr is line-prefixed with `[<port>]` and
 *     forwarded to the parent's streams so output remains traceable.
 *  5. Parent waits for all children, exits with the highest child code.
 *
 * Extra CLI args after `--` are forwarded to every child, so e.g.
 * `npm run e2e:test -- --grep @canary` propagates to all stacks.
 *
 * Each child writes traces, screenshots, and reports under per-config
 * subdirectories (`test-results/<config>`, `playwright-report/<config>`)
 * so concurrent children can't race over the same artifact paths.
 */

import {spawn, type ChildProcess} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {createInterface} from 'node:readline';

import {BOLD, CYAN, DIM, GREEN, RED, RESET, YELLOW} from '../helpers/ansi';
import {CANARY, CONFIGS, bareConfigName, portOf, type ConfigInfo} from '../helpers/config';
import {printMatrix} from '../helpers/summary-reporter';

const PLAYWRIGHT_CONFIG = './e2e/playwright.config.ts';
const EXTRA_ARGS = process.argv.slice(2);
const JSON_OUTPUT_DIR = path.resolve(process.cwd(), 'e2e', 'playwright-report', 'parallel-results');
const jsonPathFor = (config: ConfigInfo) => path.join(JSON_OUTPUT_DIR, `${config.name}.json`);

interface PlaywrightJsonStats {
	expected: number;
	unexpected: number;
	flaky: number;
	skipped: number;
	duration: number;
}

interface StackResult {
	config: ConfigInfo;
	exitCode: number;
	stats?: PlaywrightJsonStats;
}

async function listTestCounts(): Promise<Map<string, number>> {
	return new Promise((resolve, reject) => {
		const proc = spawn(
			'npx',
			['playwright', 'test', '--list', '--reporter=json', `--config=${PLAYWRIGHT_CONFIG}`, ...EXTRA_ARGS],
			{
				stdio: ['ignore', 'pipe', 'inherit'],
				env: {...process.env, ORCHARD_E2E_PARALLEL: '1'},
			},
		);
		let json = '';
		proc.stdout.on('data', (chunk: Buffer) => {
			json += chunk.toString();
		});
		proc.on('error', reject);
		proc.on('exit', (code) => {
			if (code !== 0) {
				reject(new Error(`playwright --list exited ${code}`));
				return;
			}
			try {
				const counts = new Map<string, number>();
				type Suite = {suites?: Suite[]; specs?: {tests?: {projectName: string}[]}[]};
				const walk = (suite: Suite): void => {
					for (const child of suite.suites ?? []) walk(child);
					for (const spec of suite.specs ?? []) {
						for (const t of spec.tests ?? []) {
							const bare = bareConfigName(t.projectName);
							counts.set(bare, (counts.get(bare) ?? 0) + 1);
						}
					}
				};
				const parsed = JSON.parse(json) as {suites?: Suite[]};
				for (const s of parsed.suites ?? []) walk(s);
				resolve(counts);
			} catch (e) {
				reject(e instanceof Error ? e : new Error(String(e)));
			}
		});
	});
}

const active: ChildProcess[] = [];

async function runProject(config: ConfigInfo): Promise<number> {
	const port = portOf(config);
	const projectName = `${config.name}:${port}`;
	const prefix = `[:${port}] `;
	const outputDir = `./e2e/test-results/${config.name}`;

	return new Promise((resolve) => {
		const proc = spawn(
			'npx',
			[
				'playwright',
				'test',
				`--config=${PLAYWRIGHT_CONFIG}`,
				'--project',
				projectName,
				`--output=${outputDir}`,
				...EXTRA_ARGS,
			],
			{
				stdio: ['ignore', 'pipe', 'pipe'],
				env: {
					...process.env,
					ORCHARD_E2E_PARALLEL: '1',
					// Per-child report folders so concurrent children can't race over
					// the same artifact paths (traces/screenshots/html/json).
					PLAYWRIGHT_HTML_REPORT_DIR: `./e2e/playwright-report/${config.name}`,
					PLAYWRIGHT_JSON_OUTPUT_FILE: jsonPathFor(config),
					// Children pipe to us, not a TTY — without this they'd emit
					// color-stripped output for the list/summary reporters.
					FORCE_COLOR: process.env.FORCE_COLOR ?? '1',
				},
			},
		);
		active.push(proc);

		// stdio: ['ignore', 'pipe', 'pipe'] guarantees both streams; assert for the typechecker.
		const out = createInterface({input: proc.stdout!});
		const err = createInterface({input: proc.stderr!});
		const stream = (target: NodeJS.WriteStream) => (l: string) => {
			if (l.trim() === '') return;
			target.write(`${prefix}${l}\n`);
		};
		out.on('line', stream(process.stdout));
		err.on('line', stream(process.stderr));

		proc.on('exit', (code) => resolve(code ?? 1));
	});
}

function installSignalForwarders(): void {
	const forward = (sig: NodeJS.Signals) => () => {
		for (const proc of active) proc.kill(sig);
	};
	process.on('SIGINT', forward('SIGINT'));
	process.on('SIGTERM', forward('SIGTERM'));
}

function fmtDuration(ms: number): string {
	if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
	const m = Math.floor(ms / 60_000);
	const s = Math.round((ms % 60_000) / 1000);
	return `${m}m${s.toString().padStart(2, '0')}s`;
}

function readResultsFor(config: ConfigInfo): PlaywrightJsonStats | undefined {
	try {
		const raw = fs.readFileSync(jsonPathFor(config), 'utf8');
		return (JSON.parse(raw) as {stats: PlaywrightJsonStats}).stats;
	} catch {
		return undefined;
	}
}

/** Renders a count cell — colored when non-zero, dim em-dash otherwise. */
const countOrDash = (n: number, color: string, label: string): string =>
	n > 0 ? `${color}${n} ${label}${RESET}` : `${DIM}—${RESET}`;

function printResultsTable(results: StackResult[], wallMs: number): void {
	const lines: string[] = [''];
	const title = ' ORCHARD E2E RESULTS ';

	let totalPassed = 0;
	let totalFailed = 0;
	let totalSkipped = 0;
	let totalFlaky = 0;
	for (const r of results) {
		if (!r.stats) continue;
		totalPassed += r.stats.expected;
		totalFailed += r.stats.unexpected;
		totalSkipped += r.stats.skipped;
		totalFlaky += r.stats.flaky;
	}

	lines.push(`${DIM}━━━${RESET}${BOLD}${CYAN}${title}${RESET}${DIM}${'━'.repeat(60)}${RESET}`);
	for (const r of results) {
		const port = `:${portOf(r.config)}`;
		const portCell = `${BOLD}${r.config.name === CANARY ? YELLOW : CYAN}${port}${RESET}`;
		if (!r.stats) {
			lines.push(`  ${portCell}  ${RED}✗${RESET}  ${DIM}no results (exit ${r.exitCode})${RESET}`);
			continue;
		}
		const failed = r.stats.unexpected;
		const status = failed === 0 ? `${GREEN}✓${RESET}` : `${RED}✗${RESET}`;
		const cells = [
			status,
			`${GREEN}${r.stats.expected} passed${RESET}`,
			countOrDash(r.stats.skipped, DIM, 'skipped'),
			failed > 0 ? `${RED}${failed} failed${RESET}` : `${DIM}0 failed${RESET}`,
			countOrDash(r.stats.flaky, YELLOW, 'flaky'),
			`${DIM}${fmtDuration(r.stats.duration)}${RESET}`,
		];
		lines.push(`  ${portCell}  ${cells.join('  ')}`);
	}

	lines.push(`${DIM}${'─'.repeat(80)}${RESET}`);

	const overallFailed = totalFailed > 0 || results.some((r) => !r.stats);
	const overallStatus = overallFailed ? `${RED}✗${RESET}` : `${GREEN}✓${RESET}`;
	const totalCells = [
		`${BOLD}Total${RESET}`,
		overallStatus,
		`${GREEN}${totalPassed} passed${RESET}`,
		countOrDash(totalSkipped, DIM, 'skipped'),
		totalFailed > 0 ? `${RED}${totalFailed} failed${RESET}` : `${DIM}0 failed${RESET}`,
		countOrDash(totalFlaky, YELLOW, 'flaky'),
		`${DIM}wall ${fmtDuration(wallMs)}${RESET}`,
	];
	lines.push(`  ${totalCells.join('  ')}`);
	lines.push('');

	process.stdout.write(lines.join('\n') + '\n');
}

async function main(): Promise<void> {
	installSignalForwarders();

	const counts = await listTestCounts().catch((e: Error) => {
		process.stderr.write(`Failed to list tests: ${e.message}\n`);
		return new Map<string, number>();
	});

	printMatrix(counts);

	const targets = Object.values(CONFIGS).filter((c) => (counts.get(c.name) ?? 0) > 0);
	if (targets.length === 0) {
		process.stderr.write('No projects to run.\n');
		process.exit(1);
	}

	// Wipe the JSON-results dir so a previous-run artifact can't masquerade as
	// the current run's output if a child crashes before writing its report.
	fs.rmSync(JSON_OUTPUT_DIR, {recursive: true, force: true});
	fs.mkdirSync(JSON_OUTPUT_DIR, {recursive: true});

	const startedAt = Date.now();
	const codes = await Promise.all(targets.map(runProject));
	const wallMs = Date.now() - startedAt;

	const results: StackResult[] = targets.map((config, i) => ({
		config,
		exitCode: codes[i],
		stats: readResultsFor(config),
	}));
	printResultsTable(results, wallMs);

	const fail = codes.find((c) => c !== 0) ?? 0;
	process.exit(fail);
}

void main();
