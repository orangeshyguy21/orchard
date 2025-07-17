/* Core Dependencies */
import {
	ChangeDetectionStrategy,
	Component,
	Input,
	ViewChild,
	ElementRef,
	Output,
	EventEmitter,
	AfterViewInit,
	OnInit,
	OnDestroy,
	ChangeDetectorRef,
} from '@angular/core';
import {FormGroup, FormArray} from '@angular/forms';
/* Vendor Dependencies */
import {Subscription} from 'rxjs';

@Component({
	selector: 'orc-mint-info-form-url',
	standalone: false,
	templateUrl: './mint-info-form-url.component.html',
	styleUrl: './mint-info-form-url.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintInfoFormUrlComponent implements OnInit, AfterViewInit, OnDestroy {
	@Input() form_group!: FormGroup;
	@Input() form_array!: FormArray;
	@Input() array_name!: string;
	@Input() control_index!: number;
	@Input() focused!: boolean;

	@Output() update = new EventEmitter<number>();
	@Output() cancel = new EventEmitter<number>();
	@Output() remove = new EventEmitter<number>();

	@ViewChild('element_url') element_url!: ElementRef<HTMLInputElement>;

	public url_icon: string = 'language';

	public get form_hot(): boolean {
		if (document.activeElement === this.element_url?.nativeElement) return true;
		return this.form_array.at(this.control_index)?.dirty ? true : false;
	}

	public get control_invalid(): boolean {
		return (
			(this.form_array.at(this.control_index)?.invalid &&
				(this.form_array.at(this.control_index)?.dirty || this.form_array.at(this.control_index)?.touched)) ||
			false
		);
	}

	private subscription: Subscription = new Subscription();

	constructor(private cdr: ChangeDetectorRef) {}

	ngOnInit(): void {
		this.subscription.add(
			this.form_array.valueChanges.subscribe((value) => {
				this.url_icon = this.getUrlIcon();
				this.cdr.detectChanges();
			}),
		);
	}

	ngAfterViewInit(): void {
		this.url_icon = this.getUrlIcon();
		this.cdr.detectChanges();
		if (this.focused) {
			setTimeout(() => {
				this.element_url.nativeElement.focus();
			});
		}
	}

	public onSubmit(event: Event): void {
		event.preventDefault();
		this.update.emit(this.control_index);
		this.element_url.nativeElement.blur();
	}

	public onCancel(event: Event): void {
		event.preventDefault();
		this.cancel.emit(this.control_index);
		this.element_url.nativeElement.blur();
	}

	public onRemove(event: Event): void {
		event.preventDefault();
		event.stopPropagation();
		this.remove.emit(this.control_index);
		this.element_url.nativeElement.blur();
	}

	private getUrlIcon(): string {
		const url = this.form_array.at(this.control_index)?.value;
		if (!url) return 'language';
		if (url.slice(-6) === '.onion') return 'tor';
		if (url.slice(0, 5) === 'https') return 'vpn_lock_2';
		return 'language';
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}
}
