/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
/* Application Dependencies */
import {Nut17Commands} from '@client/modules/mint/types/nut.types';

@Component({
	selector: 'orc-mint-subsection-config-nut17-commands',
	standalone: false,
	templateUrl: './mint-subsection-config-nut17-commands.component.html',
	styleUrl: './mint-subsection-config-nut17-commands.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionConfigNut17CommandsComponent {
	@Input() nut17_commands!: Nut17Commands;
}
