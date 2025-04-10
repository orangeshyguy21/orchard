/* Core Dependencies */
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
/* Application Dependencies */
import { AiService } from '@client/modules/ai/services/ai/ai.service';

@Component({
	selector: 'orc-ai-input',
	standalone: false,
	templateUrl: './ai-input.component.html',
	styleUrl: './ai-input.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiInputComponent {

	public content = new FormControl('');

	constructor(
		public aiService: AiService
	) {}

	public onSubmit(event?: any): void {
		if( event ) event.preventDefault();
		this.startChat();
	}

	startChat() {
		this.aiService.subscribeToAiChat(this.content.value).subscribe({
			next: (message) => {
				console.log('MESSAGE RECEIVED IN COMPONENT', message);
			},
			error: (error) => console.error('Chat error:', error)
		});
	}


}
