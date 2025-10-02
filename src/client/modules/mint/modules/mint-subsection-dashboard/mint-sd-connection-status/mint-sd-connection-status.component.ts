/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
/* Application Dependencies */
import {PublicUrl} from '@client/modules/public/classes/public-url.class';

@Component({
	selector: 'orc-mint-sd-connection-status',
	standalone: false,
	templateUrl: './mint-sd-connection-status.component.html',
	styleUrl: './mint-sd-connection-status.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSDConnectionStatusComponent {
	@Input() public public_url!: PublicUrl;

	public get status_class(): string {
		if (!this.public_url) return 'orc-surface-container-high-color';
		if (this.public_url.status !== 200) return 'orc-status-inactive-color';
		if (!this.public_url.has_data) return 'orc-status-warning-color';
		if (this.public_url.has_data) return 'orc-status-active-color';
		return 'orc-surface-container-high-color';
	}

	public get status_tooltip(): string {
		if (!this.public_url) return '';
		if (this.public_url.status !== 200) return 'Not reachable';
		if (!this.public_url.has_data) return 'API offline';
		return 'Publicly reachable';
	}
}
