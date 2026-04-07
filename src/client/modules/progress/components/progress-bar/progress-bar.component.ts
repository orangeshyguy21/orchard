import {ChangeDetectionStrategy, Component, input} from '@angular/core';

@Component({
	selector: 'orc-progress-bar',
	standalone: false,
	templateUrl: './progress-bar.component.html',
	styleUrl: './progress-bar.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {'[style.--bar-height]': 'height()'},
})
export class ProgressBarComponent {
	public value = input.required<number>();
	public height = input<string>('1rem');
	public variant = input<'' | 'progress-warning'>('');
}
