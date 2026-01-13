/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input} from '@angular/core';

@Component({
	selector: 'orc-mint-subsection-config-stat',
	standalone: false,
	templateUrl: './mint-subsection-config-stat.component.html',
	styleUrl: './mint-subsection-config-stat.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionConfigStatComponent {
	public loading = input.required<boolean>();
}
