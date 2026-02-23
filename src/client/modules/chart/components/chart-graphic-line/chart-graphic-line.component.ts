/* Core Dependencies */
import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';

@Component({
	selector: 'orc-chart-graphic-line',
	standalone: false,
	templateUrl: './chart-graphic-line.component.html',
	styleUrl: './chart-graphic-line.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartGraphicLineComponent {
	public points = input.required<number[]>();

	/** SVG polyline points string normalized to a 100x100 viewBox. */
	public polyline_points = computed(() => {
		const data = this.points();
		if (data.length < 2) return '';
		const max = Math.max(...data);
		if (max === 0) return '';
		const step = 100 / (data.length - 1);
		return data.map((value, i) => `${i * step},${100 - (value / max) * 100}`).join(' ');
	});

	/** SVG polygon points for the filled area beneath the line. */
	public area_points = computed(() => {
		const line = this.polyline_points();
		if (!line) return '';
		const data = this.points();
		const step = 100 / (data.length - 1);
		return `0,100 ${line} ${(data.length - 1) * step},100`;
	});
}
