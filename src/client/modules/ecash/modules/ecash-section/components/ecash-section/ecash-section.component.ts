import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
	selector: 'orc-ecash-section',
	standalone: false,
	templateUrl: './ecash-section.component.html',
	styleUrl: './ecash-section.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcashSectionComponent {}
