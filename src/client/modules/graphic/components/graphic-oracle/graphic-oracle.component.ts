/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input} from '@angular/core';
/* Shared Dependencies */
import {UtxOracleProgressStatus} from '@shared/generated.types';

@Component({
	selector: 'orc-graphic-oracle',
	standalone: false,
	templateUrl: './graphic-oracle.component.html',
	styleUrl: './graphic-oracle.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraphicOracleComponent {
	public surface = input<boolean>(false);
	public height = input.required<string>();
	public running = input.required<boolean>();
	public status = input.required<UtxOracleProgressStatus | null>();

	public UtxOracleProgressStatus = UtxOracleProgressStatus;
}
