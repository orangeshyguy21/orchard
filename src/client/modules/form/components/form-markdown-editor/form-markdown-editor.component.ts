/* Core Dependencies */
import {ChangeDetectionStrategy, Component, ElementRef, forwardRef, input, output, signal, viewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
	selector: 'orc-form-markdown-editor',
	standalone: false,
	templateUrl: './form-markdown-editor.component.html',
	styleUrl: './form-markdown-editor.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => FormMarkdownEditorComponent),
			multi: true,
		},
	],
})
export class FormMarkdownEditorComponent implements ControlValueAccessor {
	/* ── Inputs ── */
	public readonly hot = input<boolean>(false);
	public readonly invalid = input<boolean>(false);
	public readonly placeholder = input<string>('');
	public readonly height = input<string>('12rem');

	/* ── Outputs ── */
	public readonly focusChange = output<boolean>();

	/* ── Public signals ── */
	public readonly focused = signal<boolean>(false);
	public readonly disabled = signal<boolean>(false);

	/* ── Private fields ── */
	private readonly editor_ref = viewChild<ElementRef<HTMLDivElement>>('editorRef');
	private _value = '';
	private _onChange: (value: string) => void = () => {};
	private _onTouched: () => void = () => {};
	private _is_composing = false;

	/* *******************************************************
		ControlValueAccessor
	******************************************************** */

	/** Writes a new value from the form model into the editor */
	writeValue(value: string | null): void {
		this._value = value ?? '';
		this.renderHighlightedContent();
	}

	/** Registers the onChange callback */
	registerOnChange(fn: (value: string) => void): void {
		this._onChange = fn;
	}

	/** Registers the onTouched callback */
	registerOnTouched(fn: () => void): void {
		this._onTouched = fn;
	}

	/** Sets the disabled state */
	setDisabledState(disabled: boolean): void {
		this.disabled.set(disabled);
	}

	/* *******************************************************
		Event Handlers
	******************************************************** */

	/** Handles input events from the contenteditable div */
	onInput(): void {
		if (this._is_composing) return;
		const el = this.editor_ref()?.nativeElement;
		if (!el) return;

		this._value = this.extractText(el);
		this._onChange(this._value);
		this.renderHighlightedContent();
	}

	/** Handles focus on the editor */
	onFocus(): void {
		this.focused.set(true);
		this.focusChange.emit(true);
		this._onTouched();
	}

	/** Handles blur from the editor */
	onBlur(): void {
		this.focused.set(false);
		this.focusChange.emit(false);
	}

	/** Handles keydown events for special keys */
	onKeyDown(event: KeyboardEvent): void {
		if (event.key === 'Enter') {
			event.preventDefault();
			document.execCommand('insertLineBreak');
			this.onInput();
		}
		if (event.key === 'Tab') {
			event.preventDefault();
			document.execCommand('insertText', false, '  ');
			this.onInput();
		}
	}

	/** Handles paste events — strips rich text */
	onPaste(event: ClipboardEvent): void {
		event.preventDefault();
		const text = event.clipboardData?.getData('text/plain') ?? '';
		document.execCommand('insertText', false, text);
		this.onInput();
	}

	/** Marks the start of an IME composition */
	onCompositionStart(): void {
		this._is_composing = true;
	}

	/** Marks the end of an IME composition */
	onCompositionEnd(): void {
		this._is_composing = false;
		this.onInput();
	}

	/* *******************************************************
		Rendering
	******************************************************** */

	/** Renders the highlighted markdown content into the contenteditable div */
	private renderHighlightedContent(): void {
		const el = this.editor_ref()?.nativeElement;
		if (!el) return;

		if (!this._value) {
			el.innerHTML = '';
			return;
		}

		const cursor_offset = this.saveCursorPosition(el);
		const html = this.tokenize(this._value);
		el.innerHTML = html;

		if (cursor_offset !== null) {
			this.restoreCursorPosition(el, cursor_offset);
		}
	}

	/** Tokenizes raw markdown text into HTML with highlight spans */
	private tokenize(text: string): string {
		return text
			.split('\n')
			.map((line) => this.tokenizeLine(line))
			.join('\n');
	}

	/** Tokenizes a single line of markdown */
	private tokenizeLine(line: string): string {
		const escaped = this.escapeHtml(line);

		/* Line-level tokens */
		const header_match = escaped.match(/^(#{1,6})\s(.*)$/);
		if (header_match) {
			const inline_content = this.tokenizeInline(header_match[2]);
			return `<span class="md-header-marker">${header_match[1]}</span> <span class="md-header">${inline_content}</span>`;
		}

		const blockquote_match = escaped.match(/^(&gt;)\s(.*)$/);
		if (blockquote_match) {
			return `<span class="md-blockquote">${blockquote_match[1]} ${blockquote_match[2]}</span>`;
		}

		const hr_match = escaped.match(/^(-{3,})$/);
		if (hr_match) {
			return `<span class="md-hr">${hr_match[1]}</span>`;
		}

		const list_match = escaped.match(/^(-)\s(.*)$/);
		if (list_match) {
			const inline_content = this.tokenizeInline(list_match[2]);
			return `<span class="md-list-marker">-</span> ${inline_content}`;
		}

		return this.tokenizeInline(escaped);
	}

	/** Tokenizes inline markdown tokens within a line */
	private tokenizeInline(text: string): string {
		let result = text;

		/* Inline code */
		result = result.replace(/`([^`]+)`/g, '<span class="md-code">`$1`</span>');

		/* Bold */
		result = result.replace(
			/\*\*([^*]+)\*\*/g,
			'<span class="md-bold-marker">**</span><span class="md-bold">$1</span><span class="md-bold-marker">**</span>',
		);

		/* Italic */
		result = result.replace(
			/\*([^*]+)\*/g,
			'<span class="md-italic-marker">*</span><span class="md-italic">$1</span><span class="md-italic-marker">*</span>',
		);

		/* Links */
		result = result.replace(
			/\[([^\]]+)\]\(([^)]+)\)/g,
			'<span class="md-link-bracket">[</span><span class="md-link-text">$1</span><span class="md-link-bracket">]</span><span class="md-link-bracket">(</span><span class="md-link-url">$2</span><span class="md-link-bracket">)</span>',
		);

		return result;
	}

	/* *******************************************************
		Cursor Management
	******************************************************** */

	/** Saves the current cursor position as an absolute text offset */
	private saveCursorPosition(container: HTMLElement): number | null {
		const selection = window.getSelection();
		if (!selection || selection.rangeCount === 0) return null;

		const range = selection.getRangeAt(0);
		if (!container.contains(range.startContainer)) return null;

		const pre_range = document.createRange();
		pre_range.selectNodeContents(container);
		pre_range.setEnd(range.startContainer, range.startOffset);

		return pre_range.toString().length;
	}

	/** Restores cursor position from an absolute text offset */
	private restoreCursorPosition(container: HTMLElement, offset: number): void {
		const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
		let current_offset = 0;
		let node: Text | null = null;

		while ((node = walker.nextNode() as Text | null)) {
			const node_length = node.textContent?.length ?? 0;
			if (current_offset + node_length >= offset) {
				const selection = window.getSelection();
				if (!selection) return;
				const range = document.createRange();
				range.setStart(node, offset - current_offset);
				range.collapse(true);
				selection.removeAllRanges();
				selection.addRange(range);
				return;
			}
			current_offset += node_length;
		}

		/* Fallback: place cursor at end */
		const selection = window.getSelection();
		if (!selection) return;
		const range = document.createRange();
		range.selectNodeContents(container);
		range.collapse(false);
		selection.removeAllRanges();
		selection.addRange(range);
	}

	/* *******************************************************
		Utilities
	******************************************************** */

	/** Extracts plain text from a contenteditable element */
	private extractText(el: HTMLElement): string {
		return (el.innerText || '').replace(/\n$/, '');
	}

	/** Escapes HTML special characters */
	private escapeHtml(text: string): string {
		return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}
}
