/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, ViewChild, ElementRef, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { FormGroup } from '@angular/forms';
import { Subject, debounceTime, takeUntil } from 'rxjs';
/* Application Dependencies */
import { MintInfoRpc } from '@client/modules/mint/classes/mint-info-rpc.class';

@Component({
	selector: 'orc-mint-info-form-icon',
	standalone: false,
	templateUrl: './mint-info-form-icon.component.html',
	styleUrl: './mint-info-form-icon.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
		trigger('enterScaleAnimation', [
            transition(':enter', [
                style({ transform: 'scale(0.8)', opacity: 0.5 }),
                animate('150ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
            ]),
        ]),
        trigger('enterAnimation', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('150ms ease-out', style({ opacity: 1 }))
            ]),
        ])
	]
})
export class MintInfoFormIconComponent implements OnInit, OnDestroy {

	@Input() form_group!: FormGroup;
    @Input() control_name!: keyof MintInfoRpc;
	@Input() icon_url: string | null = null;

    @Output() update = new EventEmitter<keyof MintInfoRpc>();
    @Output() cancel = new EventEmitter<keyof MintInfoRpc>();

	@ViewChild('element_icon_url') element_icon_url!: ElementRef<HTMLInputElement>;

    public form_ready: boolean = false;

    private url_loading: boolean = false;
    private url_valid: boolean = true;
    private form_url!: string;
    private destroy$ = new Subject<void>();

	public get display_icon_url(): string {
        if( this.form_url !== undefined ) return this.form_url;
        return this.icon_url || '';
	}

    public get icon_state(): string {
        if (this.url_loading) return 'loading';
        if (!this.display_icon_url) return 'empty';
        return this.url_valid ? 'set' : 'error';
    }
	
    constructor(
        private cdr: ChangeDetectorRef
    ){}

	ngOnInit(): void {
        setTimeout(() => {
            this.form_ready = true;
            this.cdr.detectChanges();
        });
        this.form_group.get(this.control_name)?.valueChanges
            .pipe(
                debounceTime(1000),
                takeUntil(this.destroy$),
            )
            .subscribe(value => {
                this.renderIconUrl(value);
            });
	}

    public get form_hot(): boolean {
        if( document.activeElement === this.element_icon_url?.nativeElement ) return true;
        return this.form_group.get(this.control_name)?.dirty ? true : false;
    }

	public onIconClick(): void {
		this.element_icon_url.nativeElement.focus();
	}

	public onSubmit(event: Event): void {
        event.preventDefault();
        this.update.emit(this.control_name);
        this.element_icon_url.nativeElement.blur();
    }

    public onCancel(event: Event): void {
        event.preventDefault();
        this.cancel.emit(this.control_name);
        this.element_icon_url.nativeElement.blur();
        this.form_url = this.icon_url || '';
        this.cdr.detectChanges();
    }

    private renderIconUrl(url: string): void {
        this.form_url = url;
        this.cdr.detectChanges();
        if(!url) return;
        this.url_loading = true;
        this.cdr.detectChanges();
        const img = new Image();
        img.src = url;

        img.onload = () => {
            setTimeout(() => {
                this.url_loading = false;
                this.url_valid = true;
                this.cdr.detectChanges();
            }, 1000);
        };
        img.onerror = () => {
            setTimeout(() => {
                this.url_loading = false;
                this.url_valid = false;
                this.form_group.get(this.control_name)?.setErrors({ error: 'Invalid URL' }); // todo this doesn't go until blur...
                this.cdr.detectChanges();
            }, 1000);
        };
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}