/**
 * Markdown highlighter for the contenteditable editor.
 *
 * Wraps source markdown in highlight spans WITHOUT removing the source
 * characters — markers like `**`, `` ` ``, and `#` must remain visible so the
 * cursor offset math in the editor stays aligned.
 *
 * Architecture:
 *  - Block pre-pass: detects multi-line fenced code blocks (``` ... ```).
 *  - Per-line block classifier: header / hr / blockquote / list / paragraph.
 *  - Inline scanner: single left-to-right pass producing opaque atoms for
 *    code spans and links, with recursive emphasis inside text segments.
 *
 * The sequential-replace approach (regex over already-emitted HTML) is
 * intentionally avoided — it corrupts code-span contents and link text.
 */

/* *******************************************************
	Escaping
******************************************************** */

/** Escapes HTML special characters */
function escapeHtml(text: string): string {
	return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* *******************************************************
	Inline scanner
******************************************************** */

interface InlineMatch {
	html: string;
	end: number;
}

/** Returns true if `ch` is an ASCII word character (letter, digit, underscore) */
function isWordChar(ch: string | undefined): boolean {
	return !!ch && /\w/.test(ch);
}

/** Returns true if `ch` is whitespace */
function isSpace(ch: string | undefined): boolean {
	return !!ch && /\s/.test(ch);
}

/**
 * Tries to consume an inline code span starting at position `i`.
 * Matches the CommonMark rule: opening run of N backticks closes on the
 * next run of EXACTLY N backticks (not part of a longer run).
 */
function tryCode(text: string, i: number): InlineMatch | null {
	if (text[i] !== '`') return null;

	let run = 0;
	while (text[i + run] === '`') run++;

	let j = i + run;
	while (j < text.length) {
		if (text[j] !== '`') {
			j++;
			continue;
		}
		let r = 0;
		while (text[j + r] === '`') r++;
		if (r === run) {
			const full = text.substring(i, j + run);
			return {
				html: `<span class="orc-md-code">${escapeHtml(full)}</span>`,
				end: j + run,
			};
		}
		j += r;
	}
	return null;
}

/**
 * Tries to consume a link `[text](url)` starting at position `i`.
 * Link text is recursively tokenized so nested code/emphasis still highlights.
 */
function tryLink(text: string, i: number): InlineMatch | null {
	if (text[i] !== '[') return null;

	/* Find matching `]` (no nested brackets) */
	let j = i + 1;
	while (j < text.length && text[j] !== ']') j++;
	if (text[j] !== ']') return null;
	if (text[j + 1] !== '(') return null;

	/* Find matching `)` */
	let k = j + 2;
	while (k < text.length && text[k] !== ')') k++;
	if (text[k] !== ')') return null;

	const link_text = text.substring(i + 1, j);
	const url = text.substring(j + 2, k);
	if (!link_text || !url) return null;

	const inner_html = tokenizeInline(link_text);
	const html =
		`<span class="orc-md-link-bracket">[</span>` +
		`<span class="orc-md-link-text">${inner_html}</span>` +
		`<span class="orc-md-link-bracket">]</span>` +
		`<span class="orc-md-link-bracket">(</span>` +
		`<span class="orc-md-link-url">${escapeHtml(url)}</span>` +
		`<span class="orc-md-link-bracket">)</span>`;
	return {html, end: k + 1};
}

/**
 * Tries to consume `***bold italic***` starting at position `i`.
 * Emits a single span with both bold and italic classes so cursor offsets
 * stay simple (no nested marker pairs).
 */
function tryBoldItalic(text: string, i: number): InlineMatch | null {
	if (text.substring(i, i + 3) !== '***') return null;
	const after = text[i + 3];
	if (!after || isSpace(after)) return null;

	/* Find closing *** */
	let j = i + 3;
	while (j <= text.length - 3) {
		if (text.substring(j, j + 3) === '***' && !isSpace(text[j - 1])) {
			const inner = text.substring(i + 3, j);
			const inner_html = tokenizeInline(inner);
			const html =
				`<span class="orc-md-bold-marker">***</span>` +
				`<span class="orc-md-bold orc-md-italic">${inner_html}</span>` +
				`<span class="orc-md-bold-marker">***</span>`;
			return {html, end: j + 3};
		}
		j++;
	}
	return null;
}

/**
 * Tries to consume bold `**…**` or `__…__` starting at position `i`.
 * Applies cheap flanking rules:
 *  - opener: char after must not be whitespace
 *  - closer: char before must not be whitespace
 *  - for `_`: also reject if surrounded by word chars (kills snake_case)
 */
function tryBold(text: string, i: number): InlineMatch | null {
	const c = text[i];
	if ((c !== '*' && c !== '_') || text[i + 1] !== c) return null;

	const after = text[i + 2];
	if (!after || isSpace(after)) return null;
	if (c === '_' && isWordChar(text[i - 1])) return null;

	const marker = c + c;
	for (let j = i + 2; j <= text.length - 2; j++) {
		if (text[j] !== c || text[j + 1] !== c) continue;
		if (isSpace(text[j - 1])) continue;
		if (c === '_' && isWordChar(text[j + 2])) continue;

		const inner = text.substring(i + 2, j);
		const inner_html = tokenizeInline(inner);
		const html =
			`<span class="orc-md-bold-marker">${marker}</span>` +
			`<span class="orc-md-bold">${inner_html}</span>` +
			`<span class="orc-md-bold-marker">${marker}</span>`;
		return {html, end: j + 2};
	}
	return null;
}

/**
 * Tries to consume italic `*…*` or `_…_` starting at position `i`.
 * Same flanking rules as bold.
 */
function tryItalic(text: string, i: number): InlineMatch | null {
	const c = text[i];
	if (c !== '*' && c !== '_') return null;
	if (text[i + 1] === c) return null; /* let bold handle it */

	const after = text[i + 1];
	if (!after || isSpace(after)) return null;
	if (c === '_' && isWordChar(text[i - 1])) return null;

	for (let j = i + 1; j < text.length; j++) {
		if (text[j] !== c) continue;
		if (text[j + 1] === c) continue; /* part of bold marker */
		if (isSpace(text[j - 1])) continue;
		if (c === '_' && isWordChar(text[j + 1])) continue;

		const inner = text.substring(i + 1, j);
		const inner_html = tokenizeInline(inner);
		const html =
			`<span class="orc-md-italic-marker">${c}</span>` +
			`<span class="orc-md-italic">${inner_html}</span>` +
			`<span class="orc-md-italic-marker">${c}</span>`;
		return {html, end: j + 1};
	}
	return null;
}

/**
 * Tokenizes inline markdown content using a single left-to-right scan.
 * Recognizers are tried in order: code → link → bold-italic → bold → italic.
 */
function tokenizeInline(text: string): string {
	let out = '';
	let i = 0;
	while (i < text.length) {
		const match = tryCode(text, i) || tryLink(text, i) || tryBoldItalic(text, i) || tryBold(text, i) || tryItalic(text, i);
		if (match) {
			out += match.html;
			i = match.end;
			continue;
		}
		out += escapeHtml(text[i]);
		i++;
	}
	return out;
}

/* *******************************************************
	Block-level classifier
******************************************************** */

/** Tokenizes a single (non-fenced) line of markdown */
function tokenizeLine(line: string): string {
	/* Headers */
	const header_match = line.match(/^(#{1,6}) (.*)$/);
	if (header_match) {
		const inner = tokenizeInline(header_match[2]);
		return `<span class="orc-md-header-marker">${header_match[1]}</span> <span class="orc-md-header">${inner}</span>`;
	}

	/* Horizontal rules */
	if (/^-{3,}$/.test(line)) {
		return `<span class="orc-md-hr">${line}</span>`;
	}

	/* Blockquotes (one or more `>` levels) */
	const blockquote_match = line.match(/^(>+)( ?)(.*)$/);
	if (blockquote_match) {
		const markers = escapeHtml(blockquote_match[1]);
		const space = blockquote_match[2];
		const rest = tokenizeInline(blockquote_match[3]);
		return `<span class="orc-md-blockquote">${markers}${space}${rest}</span>`;
	}

	/* Unordered list (`-` or `*`) */
	const ul_match = line.match(/^([-*]) (.*)$/);
	if (ul_match) {
		return `<span class="orc-md-list-marker">${ul_match[1]}</span> ${tokenizeInline(ul_match[2])}`;
	}

	/* Ordered list (`1.` etc.) */
	const ol_match = line.match(/^(\d+\.) (.*)$/);
	if (ol_match) {
		return `<span class="orc-md-list-marker">${ol_match[1]}</span> ${tokenizeInline(ol_match[2])}`;
	}

	/* Plain paragraph */
	return tokenizeInline(line);
}

/* *******************************************************
	Public entry — block pre-pass for fenced code blocks
******************************************************** */

/** Tokenizes raw markdown text into HTML with highlight spans */
export function tokenizeMarkdown(text: string): string {
	const lines = text.split('\n');
	const out: string[] = [];
	let i = 0;

	while (i < lines.length) {
		const line = lines[i];

		/* Fenced code block: ``` opens, ``` closes on a later line */
		if (/^```/.test(line)) {
			let j = i + 1;
			while (j < lines.length && !/^```\s*$/.test(lines[j])) j++;
			if (j < lines.length) {
				const block = lines.slice(i, j + 1).join('\n');
				out.push(`<span class="orc-md-code-block">${escapeHtml(block)}</span>`);
				i = j + 1;
				continue;
			}
			/* No closing fence — fall through to inline handling */
		}

		out.push(tokenizeLine(line));
		i++;
	}

	return out.join('\n');
}
