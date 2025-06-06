/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
/* Application Dependencies */
import { PublicUrl } from '@client/modules/public/classes/public-url.class';

@Component({
	selector: 'orc-mint-connection-status',
	standalone: false,
	templateUrl: './mint-connection-status.component.html',
	styleUrl: './mint-connection-status.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintConnectionStatusComponent {

	@Input() public public_url!: PublicUrl;

	public get status_class_test(): string {
		if( !this.public_url ) return 'orc-surface-container-high-color';
		if( this.public_url.status !== 200 ) return 'orc-status-inactive-color';
		if( !this.public_url.has_data ) return 'orc-status-warning-color';
		if( this.public_url.has_data ) return 'orc-status-active-color';
		return 'orc-surface-container-high-color';
	}
}