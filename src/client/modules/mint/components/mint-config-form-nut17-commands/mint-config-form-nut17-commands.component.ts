/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
/* Application Dependencies */
import { Nut17Commands } from '@client/modules/mint/types/nut.types';

@Component({
	selector: 'orc-mint-config-form-nut17-commands',
	standalone: false,
	templateUrl: './mint-config-form-nut17-commands.component.html',
	styleUrl: './mint-config-form-nut17-commands.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintConfigFormNut17CommandsComponent {

	@Input() nut17_commands!: Nut17Commands;

}
