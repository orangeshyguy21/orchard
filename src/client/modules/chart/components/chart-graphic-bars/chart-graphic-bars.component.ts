/* Core Dependencies */
import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';

@Component({
	selector: 'orc-chart-graphic-bars',
	standalone: false,
	templateUrl: './chart-graphic-bars.component.html',
	styleUrl: './chart-graphic-bars.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartGraphicBarsComponent {
	public bars = input.required<number[]>();

	/** Raw values sorted descending and normalized to relative height percentages (max = 100%). */
	public relative_bars = computed(() => {
		const sorted = [...this.bars()].sort((a, b) => b - a);
		const max = sorted[0] ?? 0;
		if (max === 0) return [];
		return sorted.map((value) => (value / max) * 100);
	});
}
