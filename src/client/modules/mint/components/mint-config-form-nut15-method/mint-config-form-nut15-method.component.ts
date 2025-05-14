/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
/* Application Dependencies */
import { Nut15Method } from '@client/modules/mint/types/nut.types';

@Component({
	selector: 'orc-mint-config-form-nut15-method',
	standalone: false,
	templateUrl: './mint-config-form-nut15-method.component.html',
	styleUrl: './mint-config-form-nut15-method.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintConfigFormNut15MethodComponent {

	@Input() nut15_method!: Nut15Method;

}
