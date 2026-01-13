import {ChangeDetectionStrategy, Component, input} from '@angular/core';

@Component({
	selector: 'orc-crew-user-icon',
	standalone: false,
	templateUrl: './crew-user-icon.component.html',
	styleUrl: './crew-user-icon.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrewUserIconComponent {
	public is_self = input.required<boolean>();
}
