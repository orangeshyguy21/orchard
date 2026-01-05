/* Core Dependencies */
import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	ChangeDetectorRef,
	OnInit,
	OnDestroy,
	afterNextRender,
	input,
	output,
	signal,
	computed,
	viewChild,
} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Subject, debounceTime, takeUntil} from 'rxjs';
/* Application Dependencies */
import {MintInfoRpc} from '@client/modules/mint/classes/mint-info-rpc.class';

@Component({
	selector: 'orc-mint-subsection-info-form-icon',
	standalone: false,
	templateUrl: './mint-subsection-info-form-icon.component.html',
	styleUrl: './mint-subsection-info-form-icon.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionInfoFormIconComponent implements OnInit, OnDestroy {
	public form_group = input.required<FormGroup>(); // form group containing the icon control
	public control_name = input.required<keyof MintInfoRpc>(); // name of the form control to bind
	public icon_url = input<string | null>(null); // current icon URL value
	public focused = input<boolean>(false); // whether to auto-focus the input on init

	public update = output<keyof MintInfoRpc>(); // emitted when form is submitted
	public cancel = output<keyof MintInfoRpc>(); // emitted when form is cancelled

	public element_icon_url = viewChild.required<ElementRef<HTMLTextAreaElement>>('element_icon_url'); // reference to the textarea element

	public focused_icon = signal<boolean>(false); // tracks if the icon input is focused
	public help_status = signal<boolean>(false); // tracks if the help is visible
	public form_ready = signal<boolean>(false); // tracks if the form is ready

	private url_loading = signal<boolean>(false); // tracks if the icon URL is loading
	private url_valid = signal<boolean>(true); // tracks if the icon URL is valid
	private form_url = signal<string>(''); // form URL value for display
	private destroy$ = new Subject<void>(); // subject for cleanup
	private LOAD_ICON_SLEEP: number = 500; // delay for icon loading

	public display_icon_url = computed(() => {
		const form_value = this.form_url();
		if (form_value) return form_value;
		return this.icon_url() || '';
	});

	public icon_state = computed(() => {
		if (this.url_loading()) return 'loading';
		if (!this.display_icon_url()) return 'unset';
		return this.url_valid() ? 'set' : 'error';
	});

	constructor(private cdr: ChangeDetectorRef) {
		afterNextRender(() => {
			this.form_ready.set(true);
			if (this.focused()) this.element_icon_url().nativeElement.focus();
			this.cdr.detectChanges();
		});
	}

	ngOnInit(): void {
		this.form_group()
			.get(this.control_name())
			?.valueChanges.pipe(debounceTime(this.LOAD_ICON_SLEEP), takeUntil(this.destroy$))
			.subscribe((value) => {
				this.renderIconUrl(value);
			});
	}

	/**
	 * Handles icon click by focusing the textarea
	 */
	public onIconClick(): void {
		this.element_icon_url().nativeElement.focus();
	}

	/**
	 * Handles form submission by emitting update event and blurring the textarea
	 * @param {Event} event - the form submit event
	 */
	public onSubmit(event: Event): void {
		event.preventDefault();
		this.update.emit(this.control_name());
		this.element_icon_url().nativeElement.blur();
	}

	/**
	 * Handles form cancellation by emitting cancel event and blurring the textarea
	 * @param {Event} event - the cancel event
	 */
	public onCancel(event: Event): void {
		event.preventDefault();
		this.cancel.emit(this.control_name());
		this.element_icon_url().nativeElement.blur();
		this.form_url.set(this.icon_url() || '');
		this.cdr.detectChanges();
	}

	/**
	 * Renders the icon URL by loading the image and validating it
	 * @param {string} url - the URL to render
	 */
	private renderIconUrl(url: string): void {
		this.form_url.set(url);
		this.cdr.detectChanges();
		if (!url) return;
		this.url_loading.set(true);
		this.cdr.detectChanges();
		const img = new Image();
		img.src = url;

		img.onload = () => {
			setTimeout(() => {
				this.url_loading.set(false);
				this.url_valid.set(true);
				this.cdr.detectChanges();
			}, this.LOAD_ICON_SLEEP);
		};
		img.onerror = () => {
			setTimeout(() => {
				this.url_loading.set(false);
				this.url_valid.set(false);
				this.form_group().get(this.control_name())?.setErrors({error: 'Invalid URL'});
				this.cdr.detectChanges();
			}, this.LOAD_ICON_SLEEP);
		};
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
