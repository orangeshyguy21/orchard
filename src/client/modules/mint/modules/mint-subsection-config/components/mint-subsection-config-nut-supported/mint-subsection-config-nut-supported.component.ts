/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
	selector: 'orc-mint-subsection-config-nut-supported',
	standalone: false,
	templateUrl: './mint-subsection-config-nut-supported.component.html',
	styleUrl: './mint-subsection-config-nut-supported.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionConfigNutSupportedComponent {
	@Input() supported!: boolean | undefined;
	@Input() nut_index!: string;
	@Input() nut_icon!: string;
}
