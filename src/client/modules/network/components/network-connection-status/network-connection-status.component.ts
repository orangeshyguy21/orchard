/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, computed} from '@angular/core';

@Component({
	selector: 'orc-network-connection-status',
	standalone: false,
	templateUrl: './network-connection-status.component.html',
	styleUrl: './network-connection-status.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NetworkConnectionStatusComponent {
	public type = input.required<string>();
	public status = input<string | null>(null);
	public size = input<string>('md');

	/** Maps size to icon class */
	public size_class = computed(() => `icon-${this.size()}`);

	/** Maps connection type to Material icon name (tor uses svgIcon in template) */
	public icon = computed(() => {
		switch (this.type()) {
			case 'insecure':
				return 'language';
			default:
				return 'vpn_lock_2';
		}
	});

	/** Maps connection status to color class */
	public status_class = computed(() => {
		switch (this.status()) {
			case 'active':
				return 'orc-status-active-color';
			case 'inactive':
				return 'orc-status-inactive-color';
			case 'warning':
				return 'orc-status-warning-color';
			default:
				return 'orc-outline-color';
		}
	});
}
