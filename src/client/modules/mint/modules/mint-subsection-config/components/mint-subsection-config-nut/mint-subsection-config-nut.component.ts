/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input} from '@angular/core';

@Component({
	selector: 'orc-mint-subsection-config-nut',
	standalone: false,
	templateUrl: './mint-subsection-config-nut.component.html',
	styleUrl: './mint-subsection-config-nut.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionConfigNutComponent {
	public nut_index = input.required<string>();
	public supported = input.required<boolean>();

	onNutClick() {
		window.open(`https://github.com/cashubtc/nuts/blob/main/${this.nut_index}.md`, '_blank');
	}
}
