import {Directive, ElementRef, HostListener, Input} from '@angular/core';
import {MAT_INPUT_VALUE_ACCESSOR} from '@angular/material/input';
import { NgControl} from '@angular/forms';

@Directive({
	selector: 'input[inputFormat]',
	standalone: false,
	providers: [
		{provide: MAT_INPUT_VALUE_ACCESSOR, useExisting: InputFormatDirective},
	]
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
		public ngControl: NgControl
	) {
		ngControl.valueAccessor = this;
	}

	private _onChange(value: any): void {}

	private formatValue(value: string | null) {
		if (value !== null) {
			this.elementRef.nativeElement.value = this.numberWithSpaces(value);
		} else {
			this.elementRef.nativeElement.value = '';
		}
		if (this.ngControl) {
			this.ngControl.control?.markAsTouched(); // Touch input to allow MatFormField to show errors properly
		}
	}

	private numberWithSpaces(x: string) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
	}

	private unFormatValue() {
		const value = this.elementRef.nativeElement.value;
		this._value = value.replace(/[^\d.-]/g, '');
		if (value) {
			this.elementRef.nativeElement.value = this._value;
		} else {
			this.elementRef.nativeElement.value = '';
		}
	}

	@HostListener('input', ['$event.target.value'])
	onInput(value: string) {
		this._value = value.replace(/[^\d.-]/g, '');
		this._onChange(Number(this._value));
	}

	@HostListener('blur')
	_onBlur() {
		this.formatValue(this._value);
	}

	@HostListener('focus')
	onFocus() {
		this.unFormatValue();
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