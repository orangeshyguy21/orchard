import {ChangeDetectionStrategy, Component, input, computed} from '@angular/core';

@Component({
	selector: 'orc-graphic-oracle-icon',
	standalone: false,
	templateUrl: './graphic-oracle-icon.component.html',
	styleUrl: './graphic-oracle-icon.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[style.--size]': 'size_style()',
	},
})
export class GraphicOracleIconComponent {
	public size = input<number>(2);

	protected size_style = computed(() => `${this.size()}rem`);
}
