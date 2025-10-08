/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
	selector: 'orc-mint-subsection-config-nut',
	standalone: false,
	templateUrl: './mint-subsection-config-nut.component.html',
	styleUrl: './mint-subsection-config-nut.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionConfigNutComponent {
	@Input() nut_index!: string;
	@Input() supported!: boolean;

	onNutClick() {
		window.open(`https://github.com/cashubtc/nuts/blob/main/${this.nut_index}.md`, '_blank');
	}
}
