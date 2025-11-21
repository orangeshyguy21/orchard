import {ChangeDetectionStrategy, Component, input} from '@angular/core';

@Component({
	selector: 'orc-progress-circle',
	standalone: false,
	templateUrl: './progress-circle.component.html',
	styleUrl: './progress-circle.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressCircleComponent {
	public value = input.required<number | null>();
	public diameter = input<number>(25);
	public stroke_width = input<number>(3);
	// public progress_color = input<string>('orc-intermediate-progress-spinner');
	public progress_color = input<string>('');
	public background_color = input<string>('orc-background-progress-spinner');
}
