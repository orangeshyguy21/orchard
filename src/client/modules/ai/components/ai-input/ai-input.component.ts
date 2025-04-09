import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'orc-ai-input',
	standalone: false,
	templateUrl: './ai-input.component.html',
	styleUrl: './ai-input.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiInputComponent {

	constructor() {}

	public onSubmit(event?: any): void {
		if( event ) event.preventDefault();
		console.log(event);
	}

}
