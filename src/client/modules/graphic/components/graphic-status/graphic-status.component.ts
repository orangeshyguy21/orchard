/* Core Dependencies */
import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
/* Application Dependencies */
import {GraphicStatusState} from '@client/modules/graphic/types/graphic-status.types';

const STATUS_CLASS_MAP: Record<string, string> = {
	inactive: 'trans-bg-medium orc-status-inactive-bg',
	warning: 'trans-bg-medium orc-status-warning-bg',
	active: 'trans-bg-medium orc-status-active-bg',
	disabled: 'trans-bg-medium orc-outline-variant-bg',
	enabled: 'trans-bg-medium orc-primary-bg',
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
