import {Directive, ElementRef, HostListener, Inject, Input, LOCALE_ID} from '@angular/core';
import {MAT_INPUT_VALUE_ACCESSOR} from '@angular/material/input';
import {NgControl} from '@angular/forms';

@Directive({
	selector: 'input[formNumberSeparator]',
	standalone: false,
	providers: [{provide: MAT_INPUT_VALUE_ACCESSOR, useExisting: FormNumberSeparatorDirective}],
})
export class FormNumberSeparatorDirective {
	private static readonly DIGIT_RE = /\d/;

	private _value!: string | null;
	private readonly formatter: Intl.NumberFormat;
	private readonly group_separator: string;

	get value(): string | null {
		return this._value;
	}

	@Input('value')
	set value(value: string | null) {
		this._value = value;
		this.formatAndDisplay(value);
	}

	constructor(
		private elementRef: ElementRef<HTMLInputElement>,
		private ngControl: NgControl,
		@Inject(LOCALE_ID) locale: string,
	) {
		ngControl.valueAccessor = this;
		this.formatter = new Intl.NumberFormat(locale, {useGrouping: true, maximumFractionDigits: 0});
		this.group_separator = this.detectGroupSeparator();
	}

	private _onChange(_value: any): void {}

	private detectGroupSeparator(): string {
		const parts = this.formatter.formatToParts(1234567);
		return parts.find((p) => p.type === 'group')?.value ?? ',';
	}

	/**
	 * Formats a numeric value via Intl (normalizes leading zeros) and sets it on the input element
	 */
	private formatAndDisplay(value: string | null) {
		const el = this.elementRef.nativeElement;
		if (value !== null && value !== '') {
			const num = Number(value);
			el.value = !isNaN(num) ? this.formatter.format(num) : '';
		} else {
			el.value = '';
		}
		this.ngControl?.control?.markAsTouched();
	}

	/**
	 * Inserts locale group separators into a raw digit string, preserving leading zeros
	 */
	private insertGroupSeparators(digits: string): string {
		if (digits.length <= 3) return digits;
		const parts: string[] = [];
		let i = digits.length;
		while (i > 0) {
			parts.unshift(digits.slice(Math.max(0, i - 3), i));
			i -= 3;
		}
		return parts.join(this.group_separator);
	}

	private countDigitsUpTo(str: string, pos: number): number {
		let count = 0;
		for (let i = 0; i < pos && i < str.length; i++) {
			if (FormNumberSeparatorDirective.DIGIT_RE.test(str[i])) count++;
		}
		return count;
	}

	private findPositionForDigitCount(str: string, digit_count: number): number {
		if (digit_count <= 0) return 0;
		let count = 0;
		for (let i = 0; i < str.length; i++) {
			if (FormNumberSeparatorDirective.DIGIT_RE.test(str[i])) {
				count++;
				if (count === digit_count) return i + 1;
			}
		}
		return str.length;
	}

	/**
	 * Reformats a digit string with separators, emits the numeric value, and restores cursor position
	 */
	private applyEditedDigits(digits: string, target_digit_position: number) {
		const el = this.elementRef.nativeElement;
		const num = digits === '' ? null : Number(digits);
		this._value = num !== null ? num.toString() : null;
		this._onChange(num);

		const formatted = digits.length > 0 ? this.insertGroupSeparators(digits) : '';
		el.value = formatted;

		const new_cursor = this.findPositionForDigitCount(formatted, target_digit_position);
		el.setSelectionRange(new_cursor, new_cursor);
	}

	/**
	 * Handles Backspace/Delete when cursor is adjacent to a group separator.
	 * Skips the separator and removes the neighboring digit instead.
	 */
	private handleSeparatorDeletion(value: string, cursor: number, direction: 'backward' | 'forward') {
		const all_digits = value.replace(/\D/g, '');
		const digit_index =
			direction === 'backward' ? this.countDigitsUpTo(value, cursor - 1) : this.countDigitsUpTo(value, cursor);
		const remove_index = direction === 'backward' ? digit_index - 1 : digit_index;
		const new_digits = all_digits.slice(0, remove_index) + all_digits.slice(remove_index + 1);
		this.applyEditedDigits(new_digits, direction === 'backward' ? remove_index : digit_index);
	}

	@HostListener('input', ['$event'])
	onInput(_event: Event) {
		const el = this.elementRef.nativeElement;
		const raw_value = el.value;
		const cursor_pos = el.selectionStart ?? raw_value.length;
		this.applyEditedDigits(raw_value.replace(/\D/g, ''), this.countDigitsUpTo(raw_value, cursor_pos));
	}

	@HostListener('blur')
	_onBlur() {
		this.formatAndDisplay(this._value);
		this.ngControl?.control?.markAsTouched();
	}

	@HostListener('keydown', ['$event'])
	onKeyDown(event: KeyboardEvent) {
		const el = this.elementRef.nativeElement;
		const cursor = el.selectionStart ?? 0;
		const value = el.value;
		const has_selection = cursor !== el.selectionEnd;

		if (event.key === 'Backspace') {
			if (!has_selection && cursor > 1 && value[cursor - 1] === this.group_separator) {
				event.preventDefault();
				this.handleSeparatorDeletion(value, cursor, 'backward');
			}
		} else if (event.key === 'Delete') {
			if (!has_selection && cursor < value.length && value[cursor] === this.group_separator) {
				event.preventDefault();
				this.handleSeparatorDeletion(value, cursor, 'forward');
			}
		} else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
			event.preventDefault();
			const current_value = this._value ? Number(this._value) : 0;
			const new_value = current_value + (event.key === 'ArrowUp' ? 1 : -1);
			this._value = new_value.toString();
			this._onChange(new_value);
			el.value = this.formatter.format(new_value);
			this.ngControl?.control?.markAsTouched();
		}
	}

	writeValue(value: any) {
		this._value = value !== null && value !== undefined ? value.toString() : null;
		this.formatAndDisplay(this._value);
	}

	registerOnChange(fn: (value: any) => void) {
		this._onChange = fn;
	}

	registerOnTouched() {}
}
