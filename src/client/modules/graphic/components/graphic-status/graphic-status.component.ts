import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';

export type GraphicStatusState = 'inactive' | 'warning' | 'active' | 'loading' | null;

const STATUS_CLASS_MAP: Record<string, string> = {
	inactive: 'trans-bg-medium orc-status-inactive-bg',
	warning: 'trans-bg-medium orc-status-warning-bg',
	active: 'trans-bg-medium orc-status-active-bg',
	loading: 'orc-animation-shimmer-highest',
};

@Component({
	selector: 'orc-graphic-status',
	standalone: false,
	templateUrl: './graphic-status.component.html',
	styleUrl: './graphic-status.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[style.--status-size]': 'size()',
	},
})
export class GraphicStatusComponent {
	public size = input<string>('0.5rem');
	public status = input<GraphicStatusState>(null);

	public indicator_class = computed(() => STATUS_CLASS_MAP[this.status() ?? ''] ?? '');
}
