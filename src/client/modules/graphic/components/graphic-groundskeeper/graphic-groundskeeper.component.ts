/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input} from '@angular/core';

@Component({
	selector: 'orc-graphic-groundskeeper',
	standalone: false,
	templateUrl: './graphic-groundskeeper.component.html',
	styleUrl: './graphic-groundskeeper.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraphicGroundskeeperComponent {
	public surface = input<boolean>(false);
	public active = input<boolean>(false);
	public height = input.required<string>();
	public running = input.required<boolean>();
	public state = input<'error' | 'success' | null>();
}
