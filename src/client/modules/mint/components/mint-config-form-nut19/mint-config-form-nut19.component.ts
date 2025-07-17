/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
/* Shared Dependencies */
import {OrchardNut19} from '@shared/generated.types';

@Component({
	selector: 'orc-mint-config-form-nut19',
	standalone: false,
	templateUrl: './mint-config-form-nut19.component.html',
	styleUrl: './mint-config-form-nut19.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintConfigFormNut19Component {
	@Input() nut19!: OrchardNut19 | undefined;
}
