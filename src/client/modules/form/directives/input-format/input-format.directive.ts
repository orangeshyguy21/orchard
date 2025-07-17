import {Directive, ElementRef, HostListener, Input} from '@angular/core';
import {MAT_INPUT_VALUE_ACCESSOR} from '@angular/material/input';
import {NgControl} from '@angular/forms';

@Directive({
	selector: 'input[inputFormat]',
	standalone: false,
	providers: [{provide: MAT_INPUT_VALUE_ACCESSOR, useExisting: InputFormatDirective}],
})
export class InputFormatDirective {
	private _value!: string | null;

	get value(): string | null {
		return this._value;
	}

	@Input('value')
	set value(value: string | null) {
		this._value = value;
		this.formatValue(value);
	}

	constructor(
		private elementRef: ElementRef<HTMLInputElement>,
		public ngControl: NgControl,
	) {
		ngControl.valueAccessor = this;
	}

	private _onChange(value: any): void {}

	private formatValue(value: string | null) {
		if (value !== null && value !== '') {
			this.elementRef.nativeElement.value = this.numberWithSpaces(value);
		} else {
			this.elementRef.nativeElement.value = '';
		}
		if (this.ngControl) {
			this.ngControl.control?.markAsTouched();
		}
	}

	private numberWithSpaces(x: string) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
	}

	private unFormatValue() {
		const value = this.elementRef.nativeElement.value;
		this._value = value.replace(/[^\d.-]/g, '');
		this.elementRef.nativeElement.value = this._value;
	}

	@HostListener('input', ['$event.target.value'])
	onInput(value: string) {
		this._value = value.replace(/[^\d.-]/g, '');
		this._value === '' ? this._onChange(null) : this._onChange(Number(this._value));
	}

	@HostListener('blur')
	_onBlur() {
		this.formatValue(this._value);
	}

	@HostListener('focus')
	onFocus() {
		this.unFormatValue();
	}

	@HostListener('keydown', ['$event'])
	onKeyDown(event: KeyboardEvent) {
		if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
			event.preventDefault();
			const current_value = this._value ? Number(this._value) : 0;
			const increment = event.key === 'ArrowUp' ? 1 : -1;
			const new_value = current_value + increment;
			this._value = new_value.toString();
			this._onChange(new_value);
			this.elementRef.nativeElement.value = this._value;
			if (this.ngControl) this.ngControl.control?.markAsTouched();
		}
	}

	writeValue(value: any) {
		this._value = value;
		this.formatValue(this._value);
	}

	registerOnChange(fn: (value: any) => void) {
		this._onChange = fn;
	}

	registerOnTouched() {}
}
