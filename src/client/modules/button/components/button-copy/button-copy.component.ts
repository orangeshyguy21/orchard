import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
	selector: 'orc-button-copy',
	standalone: false,
	templateUrl: './button-copy.component.html',
	styleUrl: './button-copy.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonCopyComponent {}
