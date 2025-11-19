/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input} from '@angular/core';

@Component({
	selector: 'orc-graphic-oracle',
	standalone: false,
	templateUrl: './graphic-oracle.component.html',
	styleUrl: './graphic-oracle.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraphicOracleComponent {
	public height = input.required<string>();
	public running = input.required<boolean>();
	public completed = input.required<boolean>();
}
