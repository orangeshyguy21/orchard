/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
	selector: 'orc-mint-nut',
	standalone: false,
	templateUrl: './mint-nut.component.html',
	styleUrl: './mint-nut.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintNutComponent {
	@Input() nut_index!: string;
	@Input() supported!: boolean;

	onNutClick() {
		window.open(`https://github.com/cashubtc/nuts/blob/main/${this.nut_index}.md`, '_blank');
	}
}
