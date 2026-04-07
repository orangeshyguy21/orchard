/* Local Dependencies */
import {tokenizeMarkdown} from './markdown-tokenizer.helper';

/**
 * Tokenizer specs.
 *
 * The tokenizer wraps source markdown in highlight spans WITHOUT removing the
 * source characters (markers like `**`, `` ` ``, `#` must remain visible so
 * the contenteditable cursor offsets stay aligned).
 *
 * Each `it()` block targets one numbered issue from the audit.
 */
describe('tokenizeMarkdown', () => {
	/* *******************************************************
		Helpers
	******************************************************** */

	/** Strips all HTML tags, leaving only the visible source text */
	const visibleText = (html: string): string => html.replace(/<[^>]+>/g, '');

	/** Counts non-overlapping occurrences of `needle` in `haystack` */
	const count = (haystack: string, needle: string): number => haystack.split(needle).length - 1;

	/* *******************************************************
		Source preservation invariant
	******************************************************** */

	it('preserves the exact source text after stripping spans', () => {
		const src = '# Header\n**bold** and *italic* and `code`';
		expect(visibleText(tokenizeMarkdown(src))).toBe(src);
	});

	/* *******************************************************
		Headers
	******************************************************** */

	it('renders all six header levels', () => {
		for (let i = 1; i <= 6; i++) {
			const hashes = '#'.repeat(i);
			const html = tokenizeMarkdown(`${hashes} Header`);
			expect(html).toContain('orc-md-header-marker');
			expect(html).toContain('orc-md-header');
		}
	});

	it('does not treat 7+ hashes as a header', () => {
		const html = tokenizeMarkdown('####### Not a header');
		expect(html).not.toContain('orc-md-header-marker');
	});

	it('does not treat # without a trailing space as a header', () => {
		const html = tokenizeMarkdown('#NoSpace');
		expect(html).not.toContain('orc-md-header-marker');
	});

	/* *******************************************************
		Bug 2 — code spans must protect their contents
	******************************************************** */

	it('does not italicize asterisks inside an inline code span', () => {
		const html = tokenizeMarkdown('`code with *stars* inside`');
		expect(html).not.toContain('orc-md-italic-marker');
		expect(html).not.toContain('orc-md-italic"');
	});

	it('does not bold double-asterisks inside an inline code span', () => {
		const html = tokenizeMarkdown('`code with **bold** inside`');
		expect(html).not.toContain('orc-md-bold-marker');
		expect(html).not.toContain('orc-md-bold"');
	});

	/* *******************************************************
		Bug 1 — triple-backtick code spans
	******************************************************** */

	it('handles triple-backtick inline code spans as a single atom', () => {
		const html = tokenizeMarkdown('```triple backtick fence```');
		// Exactly one code span, containing the inner text
		expect(count(html, 'orc-md-code')).toBe(1);
		expect(visibleText(html)).toBe('```triple backtick fence```');
	});

	it('handles double-backtick code spans containing a single backtick', () => {
		const html = tokenizeMarkdown('``code with ` backtick inside``');
		expect(count(html, 'orc-md-code')).toBe(1);
		expect(visibleText(html)).toBe('``code with ` backtick inside``');
	});

	/* *******************************************************
		Code span edge cases
	******************************************************** */

	it('does not emit a code span for unclosed backticks', () => {
		const html = tokenizeMarkdown('`unclosed code');
		expect(html).not.toContain('orc-md-code');
	});

	it('handles back-to-back inline code spans separated by a space', () => {
		const html = tokenizeMarkdown('`one` `two`');
		expect(count(html, 'orc-md-code')).toBe(2);
	});

	/* *******************************************************
		Bug 3 — bold wrapping a code span
	******************************************************** */

	it('keeps bold intact when it wraps an inline code span', () => {
		const html = tokenizeMarkdown('**bold with `code inside it` still bold**');
		// Bold markers present
		expect(html).toContain('orc-md-bold-marker');
		// Code span present and intact
		expect(count(html, 'orc-md-code')).toBe(1);
		// Source preserved
		expect(visibleText(html)).toBe('**bold with `code inside it` still bold**');
	});

	/* *******************************************************
		Bug 4 — mid-word bold should keep both markers
	******************************************************** */

	it('keeps both markers for mid-word bold', () => {
		const html = tokenizeMarkdown('mid**word**bold');
		expect(count(html, 'orc-md-bold-marker')).toBe(2);
		expect(visibleText(html)).toBe('mid**word**bold');
	});

	/* *******************************************************
		Bug 5 — bold-italic
	******************************************************** */

	it('renders ***bold italic*** as combined emphasis', () => {
		const html = tokenizeMarkdown('***bold italic***');
		expect(html).toContain('orc-md-bold');
		expect(html).toContain('orc-md-italic');
		expect(visibleText(html)).toBe('***bold italic***');
	});

	/* *******************************************************
		Bug 6 — emphasis flanking rules
	******************************************************** */

	it('does not italicize spaced asterisks (a * b * c)', () => {
		const html = tokenizeMarkdown('a * b * c');
		expect(html).not.toContain('orc-md-italic-marker');
	});

	it('does not italicize numeric multiplication (5 * 3)', () => {
		const html = tokenizeMarkdown('5 * 3 and 2 * 4');
		expect(html).not.toContain('orc-md-italic-marker');
	});

	it('does not italicize underscores in snake_case identifiers', () => {
		const html = tokenizeMarkdown('snake_case_variable here');
		expect(html).not.toContain('orc-md-italic-marker');
	});

	/* *******************************************************
		Bug 12, 13 — underscore emphasis
	******************************************************** */

	it('renders _underscore italic_ as italic', () => {
		const html = tokenizeMarkdown('_underscore italic_');
		expect(html).toContain('orc-md-italic');
		expect(visibleText(html)).toBe('_underscore italic_');
	});

	it('renders __underscore bold__ as bold', () => {
		const html = tokenizeMarkdown('__underscore bold__');
		expect(html).toContain('orc-md-bold');
		expect(visibleText(html)).toBe('__underscore bold__');
	});

	/* *******************************************************
		Unclosed emphasis
	******************************************************** */

	it('does not emit emphasis spans for unclosed markers', () => {
		expect(tokenizeMarkdown('*unclosed italic')).not.toContain('orc-md-italic"');
		expect(tokenizeMarkdown('**unclosed bold')).not.toContain('orc-md-bold"');
	});

	/* *******************************************************
		Links
	******************************************************** */

	it('renders a basic link', () => {
		const html = tokenizeMarkdown('[a link](https://example.com)');
		expect(html).toContain('orc-md-link-text');
		expect(html).toContain('orc-md-link-url');
		expect(visibleText(html)).toBe('[a link](https://example.com)');
	});

	/* *******************************************************
		Bugs 24, 25, 26 — link text with nested formatting
	******************************************************** */

	it('keeps the link styled when its text contains inline code', () => {
		const html = tokenizeMarkdown('[link with `code` inside](https://example.com)');
		expect(html).toContain('orc-md-link-url');
		expect(html).toContain('orc-md-code');
	});

	it('keeps the link styled when its text contains italic', () => {
		const html = tokenizeMarkdown('[link with *italic* inside](https://example.com)');
		expect(html).toContain('orc-md-link-url');
		expect(html).toContain('orc-md-italic');
	});

	it('keeps the link styled when its text contains bold', () => {
		const html = tokenizeMarkdown('[**bold link text**](https://example.com)');
		expect(html).toContain('orc-md-link-url');
		expect(html).toContain('orc-md-bold');
	});

	it('does not emit a link for unclosed bracket', () => {
		const html = tokenizeMarkdown('[broken link](unclosed');
		expect(html).not.toContain('orc-md-link-url');
	});

	/* *******************************************************
		Blockquotes
	******************************************************** */

	it('renders a basic blockquote', () => {
		const html = tokenizeMarkdown('> blockquote line');
		expect(html).toContain('orc-md-blockquote');
	});

	/* *******************************************************
		Bug 11 — nested blockquotes
	******************************************************** */

	it('renders nested blockquotes (>>) as a blockquote', () => {
		const html = tokenizeMarkdown('>> nested blockquote');
		expect(html).toContain('orc-md-blockquote');
	});

	/* *******************************************************
		Lists
	******************************************************** */

	it('renders dash list items', () => {
		const html = tokenizeMarkdown('- item one');
		expect(html).toContain('orc-md-list-marker');
	});

	/* *******************************************************
		Bug 16 — asterisk list items
	******************************************************** */

	it('renders asterisk list items', () => {
		const html = tokenizeMarkdown('* asterisk item');
		expect(html).toContain('orc-md-list-marker');
	});

	/* *******************************************************
		Bug 15 — ordered list items
	******************************************************** */

	it('renders ordered list items', () => {
		const html = tokenizeMarkdown('1. ordered item');
		expect(html).toContain('orc-md-list-marker');
	});

	/* *******************************************************
		Horizontal rules
	******************************************************** */

	it('renders a horizontal rule for 3+ dashes', () => {
		expect(tokenizeMarkdown('---')).toContain('orc-md-hr');
		expect(tokenizeMarkdown('----')).toContain('orc-md-hr');
		expect(tokenizeMarkdown('-----')).toContain('orc-md-hr');
	});

	/* *******************************************************
		Bug 17 — fenced code blocks (multi-line)
	******************************************************** */

	it('renders a multi-line fenced code block as a single code block', () => {
		const src = '```\nline one\nline two\n```';
		const html = tokenizeMarkdown(src);
		expect(html).toContain('orc-md-code-block');
		expect(visibleText(html)).toBe(src);
	});

	it('does not tokenize markdown inside a fenced code block', () => {
		const src = '```\n**not bold** and *not italic*\n```';
		const html = tokenizeMarkdown(src);
		expect(html).not.toContain('orc-md-bold"');
		expect(html).not.toContain('orc-md-italic"');
	});

	/* *******************************************************
		HTML escaping
	******************************************************** */

	it('escapes HTML special characters', () => {
		const html = tokenizeMarkdown('<script>alert(1)</script>');
		expect(html).not.toContain('<script>');
		expect(html).toContain('&lt;script&gt;');
	});

	it('escapes HTML inside inline code spans', () => {
		const html = tokenizeMarkdown('`<b>raw</b>`');
		expect(html).not.toContain('<b>raw</b>');
		expect(html).toContain('&lt;b&gt;');
	});

	/* *******************************************************
		Mixed content
	******************************************************** */

	it('handles a line with bold, code, link, and italic together', () => {
		const src = '**bold** with `code` and [link](https://x.com) and *italic*';
		const html = tokenizeMarkdown(src);
		expect(html).toContain('orc-md-bold');
		expect(html).toContain('orc-md-code');
		expect(html).toContain('orc-md-link-url');
		expect(html).toContain('orc-md-italic');
		expect(visibleText(html)).toBe(src);
	});
});
