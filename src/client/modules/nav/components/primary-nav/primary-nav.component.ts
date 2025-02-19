import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'orc-primary-nav',
	standalone: false,
	templateUrl: './primary-nav.component.html',
	styleUrl: './primary-nav.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrimaryNavComponent {

}
