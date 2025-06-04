/* Core Dependencies */
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'orc-mint-data-backup-create',
	standalone: false,
	templateUrl: './mint-data-backup-create.component.html',
	styleUrl: './mint-data-backup-create.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintDataBackupCreateComponent {

  	@Output() close = new EventEmitter<void>();

}
