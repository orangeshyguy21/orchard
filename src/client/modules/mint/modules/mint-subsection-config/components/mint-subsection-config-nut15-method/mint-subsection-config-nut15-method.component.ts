/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
/* Application Dependencies */
import {Nut15Method} from '@client/modules/mint/types/nut.types';

@Component({
	selector: 'orc-mint-subsection-config-nut15-method',
	standalone: false,
	templateUrl: './mint-subsection-config-nut15-method.component.html',
	styleUrl: './mint-subsection-config-nut15-method.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionConfigNut15MethodComponent {
	@Input() nut15_method!: Nut15Method;
}
