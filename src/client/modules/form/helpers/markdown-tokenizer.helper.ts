/** Escapes HTML special characters */
function escapeHtml(text: string): string {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Tokenizes inline markdown tokens within a line */
function tokenizeInline(text: string): string {
    let result = text;

    /* Inline code */
    result = result.replace(/`([^`]+)`/g, '<span class="orc-md-code">`$1`</span>');

    /* Bold */
    result = result.replace(
        /\*\*([^*]+)\*\*/g,
        '<span class="orc-md-bold-marker">**</span><span class="orc-md-bold">$1</span><span class="orc-md-bold-marker">**</span>',
    );

    /* Italic */
    result = result.replace(
        /\*([^*]+)\*/g,
        '<span class="orc-md-italic-marker">*</span><span class="orc-md-italic">$1</span><span class="orc-md-italic-marker">*</span>',
    );

    /* Links */
    result = result.replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<span class="orc-md-link-bracket">[</span><span class="orc-md-link-text">$1</span><span class="orc-md-link-bracket">]</span><span class="orc-md-link-bracket">(</span><span class="orc-md-link-url">$2</span><span class="orc-md-link-bracket">)</span>',
    );

    return result;
}

/** Tokenizes a single line of markdown */
function tokenizeLine(line: string): string {
    const escaped = escapeHtml(line);

    /* Headers */
    const header_match = escaped.match(/^(#{1,6})\s(.*)$/);
    if (header_match) {
        const inline_content = tokenizeInline(header_match[2]);
        return `<span class="orc-md-header-marker">${header_match[1]}</span> <span class="orc-md-header">${inline_content}</span>`;
    }

    /* Blockquotes */
    const blockquote_match = escaped.match(/^(&gt;)\s(.*)$/);
    if (blockquote_match) {
        return `<span class="orc-md-blockquote">${blockquote_match[1]} ${blockquote_match[2]}</span>`;
    }

    /* Horizontal rules */
    const hr_match = escaped.match(/^(-{3,})$/);
    if (hr_match) {
        return `<span class="orc-md-hr">${hr_match[1]}</span>`;
    }

    /* List items */
    const list_match = escaped.match(/^(-)\s(.*)$/);
    if (list_match) {
        const inline_content = tokenizeInline(list_match[2]);
        return `<span class="orc-md-list-marker">-</span> ${inline_content}`;
    }

    return tokenizeInline(escaped);
}

/** Tokenizes raw markdown text into HTML with highlight spans */
export function tokenizeMarkdown(text: string): string {
    return text
        .split('\n')
        .map((line) => tokenizeLine(line))
        .join('\n');
}
