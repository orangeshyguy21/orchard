/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input} from '@angular/core';
/* Native Dependencies */
import {MintConfigStats} from '@client/modules/mint/modules/mint-subsection-config/types/mint-config-stats.type';

@Component({
	selector: 'orc-mint-subsection-config-stats',
	standalone: false,
	templateUrl: './mint-subsection-config-stats.component.html',
	styleUrl: './mint-subsection-config-stats.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionConfigStatsComponent {
	public loading = input.required<boolean>();
	public stats = input.required<MintConfigStats>();
	public unit = input.required<string>();
}
