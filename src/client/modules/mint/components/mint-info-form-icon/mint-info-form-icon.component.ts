/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, ViewChild, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
/* Application Dependencies */
import { MintInfoRpc } from '@client/modules/mint/classes/mint-info-rpc.class';

@Component({
	selector: 'orc-mint-info-form-icon',
	standalone: false,
	templateUrl: './mint-info-form-icon.component.html',
	styleUrl: './mint-info-form-icon.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintInfoFormIconComponent implements OnInit {

	@Input() form_group!: FormGroup;
    @Input() control_name!: keyof MintInfoRpc;
	@Input() icon_url: string | null = null;

    @Output() update = new EventEmitter<keyof MintInfoRpc>();
    @Output() cancel = new EventEmitter<keyof MintInfoRpc>();

	@ViewChild('element_icon_url') element_icon_url!: ElementRef<HTMLInputElement>;

	public get display_icon_url(): string {
		return this.icon_url || '';
	}
	
    constructor(){}

	ngOnInit(): void {
		this.form_group.get(this.control_name)?.valueChanges.subscribe(value => {
			console.log('value', value);
            // this.display_icon_url = value || '';
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
    }
}

