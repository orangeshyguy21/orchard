/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, ViewChild, ElementRef, Output, EventEmitter, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';
/* Vendor Dependencies */
import { fromEvent, merge, Subscription } from 'rxjs';
import { MatSelect } from '@angular/material/select';

@Component({
	selector: 'orc-mint-info-form-contact',
	standalone: false,
	templateUrl: './mint-info-form-contact.component.html',
	styleUrl: './mint-info-form-contact.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
        trigger('methodSelectState', [
            state('closed', style({
                width: '0',
                opacity: '0',
                overflow: 'hidden'
            })),
            state('open', style({
                width: '10rem',
                opacity: '1',
				marginRight: '1rem'
            })),
            transition('closed <=> open', [
                animate('200ms ease-in-out')
            ])
        ])
    ]
})
export class MintInfoFormContactComponent implements AfterViewInit, OnDestroy {

	@Input() form_group!: FormGroup;
    @Input() form_array!: FormArray;
	@Input() array_name!: string;
    @Input() subgroup_index!: number;
    @Input() focused!: boolean;
	@Input() init_method!: string;

    @Output() update = new EventEmitter<number>();
    @Output() cancel = new EventEmitter<number>();
    @Output() remove = new EventEmitter<number>();

	@ViewChild('element_method') element_method!: MatSelect;
	@ViewChild('element_info') element_info!: ElementRef<HTMLInputElement>;

	public get contact_icon(): string {
		const method = this.form_array.at(this.subgroup_index).get('method')?.value;
		if( method === 'email' ) return 'mail';
		if( method === 'nostr' ) return 'nostr';
		if( method === 'twitter' ) return 'x';
		return 'mail';
	}

	public get form_hot(): boolean {
		if( this.form_canceled ) return false;
		if( this.method_opened || this.info_focused ) return true;
        return this.form_array.at(this.subgroup_index)?.dirty ? true : false;
    }

	private subscriptions: Subscription = new Subscription();
	private method_opened: boolean = false;
	private info_focused: boolean = false;
	private form_canceled: boolean = false;
	
	constructor(
		private cdr: ChangeDetectorRef
	){}

    ngAfterViewInit(): void {
		this.subscriptions.add(
			this.element_method.openedChange.subscribe(opened => {
				if( opened ) this.form_canceled = false;
				this.method_opened = opened;
				this.cdr.detectChanges();
			})
		);
		
		this.subscriptions.add(
			merge(
				fromEvent(this.element_info.nativeElement, 'focus'),
				fromEvent(this.element_info.nativeElement, 'blur')
			).subscribe((event: Event) => {
				if (event.type === 'focus') {
					this.info_focused = true;
					this.form_canceled = false;
					this.cdr.detectChanges();
				} else {
					setTimeout(() => {
						this.info_focused = false;
						this.cdr.detectChanges();
					},250);
				}
			})
		);

        if( this.focused ){
            setTimeout(() => {
                this.element_info.nativeElement.focus();
            });
        }
		if( this.init_method ) this.form_array.at(this.subgroup_index).get('method')?.setValue(this.init_method);
    }

    public onSubmit(event: Event): void {
        event.preventDefault();
        this.update.emit(this.subgroup_index);
        this.element_info.nativeElement.blur();
		this.element_method.close();
    }

    public onCancel(event: Event): void {
        event.preventDefault();
		this.form_canceled = true;
		this.cdr.detectChanges();
        this.cancel.emit(this.subgroup_index);
        this.element_info.nativeElement.blur();
		this.element_method.close();
    }

    public onRemove(event: Event): void {
        event.preventDefault();
        event.stopPropagation();
        this.remove.emit(this.subgroup_index);
        this.element_info.nativeElement.blur();
		this.element_method.close();
    }

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}
}