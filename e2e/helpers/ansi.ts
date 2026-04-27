/** Shared ANSI color/styling primitives for terminal output. Used by the
 *  Playwright reporter and the parallel runner so a `NO_COLOR` env var
 *  silences both surfaces consistently. */

const useColor = !process.env.NO_COLOR;
const ansi = (code: string) => (useColor ? code : '');

export const DIM = ansi('\x1b[2m');
export const BOLD = ansi('\x1b[1m');
export const CYAN = ansi('\x1b[36m');
export const YELLOW = ansi('\x1b[33m');
export const GREEN = ansi('\x1b[32m');
export const MAGENTA = ansi('\x1b[35m');
export const RED = ansi('\x1b[31m');
export const RESET = ansi('\x1b[0m');

// eslint-disable-next-line no-control-regex
const ANSI_RE = /\x1b\[[0-9;]*m/g;

/** Strip ANSI SGR sequences so length-based padding and emptiness checks work
 *  on colored strings. */
export const stripAnsi = (s: string): string => s.replace(ANSI_RE, '');
