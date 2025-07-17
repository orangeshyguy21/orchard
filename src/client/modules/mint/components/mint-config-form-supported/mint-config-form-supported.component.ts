import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
	selector: 'orc-mint-config-form-supported',
	standalone: false,
	templateUrl: './mint-config-form-supported.component.html',
	styleUrl: './mint-config-form-supported.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintConfigFormSupportedComponent {
	@Input() supported!: boolean | undefined;
	@Input() nut_index!: string;
	@Input() nut_icon!: string;
}
