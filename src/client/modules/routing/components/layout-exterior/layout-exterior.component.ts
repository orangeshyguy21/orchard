import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
	selector: 'orc-layout-exterior',
	standalone: false,
	templateUrl: './layout-exterior.component.html',
	styleUrl: './layout-exterior.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutExteriorComponent {
	constructor() {}
}
