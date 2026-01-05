/* Core Dependencies */
import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	AfterViewInit,
	OnInit,
	OnDestroy,
	ChangeDetectorRef,
	input,
	output,
	viewChild,
	signal,
	computed,
} from '@angular/core';
import {FormGroup, FormArray} from '@angular/forms';
/* Vendor Dependencies */
import {Subscription} from 'rxjs';

@Component({
	selector: 'orc-mint-subsection-info-form-url',
	standalone: false,
	templateUrl: './mint-subsection-info-form-url.component.html',
	styleUrl: './mint-subsection-info-form-url.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionInfoFormUrlComponent implements OnInit, AfterViewInit, OnDestroy {
	public form_group = input.required<FormGroup>(); // form group containing the url controls
	public form_array = input.required<FormArray>(); // form array containing url entries
	public array_name = input.required<string>(); // name of the form array to bind
	public control_index = input.required<number>(); // index of the control in the form array
	public focused = input.required<boolean>(); // whether this control should be focused

	public update = output<number>(); // emitted when the url is updated
	public cancel = output<number>(); // emitted when the url edit is cancelled
	public remove = output<number>(); // emitted when the url is removed

	public element_url = viewChild.required<ElementRef<HTMLInputElement>>('element_url'); // reference to the input element

	public url_icon = signal<string>('language'); // icon to display based on url type
	public focused_url = signal<boolean>(false); // tracks if the url input is focused
	public control_dirty = signal<boolean>(false); // tracks if the control is dirty
	public control_touched = signal<boolean>(false); // tracks if the control has been touched

	public form_hot = computed(() => {
		if (this.focused_url()) return true;
		return this.control_dirty();
	});

	public control_invalid = computed(() => {
		if (this.focused_url()) return false;
		return this.form_array().at(this.control_index())?.invalid && (this.control_dirty() || this.control_touched());
	});

	public onFocus(): void {
		this.focused_url.set(true);
	}

	public onBlur(): void {
		this.focused_url.set(false);
		this.control_touched.set(true);
	}

	private subscription: Subscription = new Subscription();

	constructor(private cdr: ChangeDetectorRef) {}

	ngOnInit(): void {
		this.subscription.add(
			this.form_array().valueChanges.subscribe(() => {
				this.url_icon.set(this.getUrlIcon());
				this.control_dirty.set(this.form_array().at(this.control_index())?.dirty ?? false);
				this.cdr.detectChanges();
			}),
		);
	}

	ngAfterViewInit(): void {
		this.url_icon.set(this.getUrlIcon());
		this.cdr.detectChanges();
		if (this.focused()) {
			setTimeout(() => {
				this.element_url().nativeElement.focus();
				this.focused_url.set(true);
			});
		}
	}

	public onSubmit(event: Event): void {
		event.preventDefault();
		this.update.emit(this.control_index());
		this.element_url().nativeElement.blur();
	}

	public onCancel(event: Event): void {
		event.preventDefault();
		this.cancel.emit(this.control_index());
		this.element_url().nativeElement.blur();
	}

	public onRemove(event: Event): void {
		event.preventDefault();
		event.stopPropagation();
		this.remove.emit(this.control_index());
		this.element_url().nativeElement.blur();
	}

	private getUrlIcon(): string {
		const url = this.form_array().at(this.control_index())?.value;
		if (!url) return 'language';
		if (url.slice(-6) === '.onion') return 'tor';
		if (url.slice(0, 5) === 'https') return 'vpn_lock_2';
		return 'language';
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}
}
