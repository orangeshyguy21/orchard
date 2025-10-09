import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
	selector: 'orc-auth-section',
	standalone: false,
	templateUrl: './auth-section.component.html',
	styleUrl: './auth-section.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthSectionComponent {}
