/* Core Dependencies */
import { ChangeDetectionStrategy, Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
/* Vendor Dependencies */
import { Subscription } from 'rxjs';
/* Application Dependencies */
import { AiService } from '@client/modules/ai/services/ai/ai.service';
/* Shared Dependencies */
import { OrchardAiChatChunk } from '@shared/generated.types';

@Component({
	selector: 'orc-ai-input',
	standalone: false,
	templateUrl: './ai-input.component.html',
	styleUrl: './ai-input.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiInputComponent implements OnDestroy {

	public content = new FormControl('');
	private chat_subscription: Subscription | null = null;

	constructor(
		public aiService: AiService,
		private cdr: ChangeDetectorRef
	) {}

	public onSubmit(event?: any): void {
		if( event ) event.preventDefault();
		this.startChat();
	}

	private startChat() {
		this.chat_subscription = this.aiService.subscribeToAiChat(this.content.value).subscribe({
			next: (ai_chat: OrchardAiChatChunk) => {
				console.log('MESSAGE RECEIVED IN COMPONENT', ai_chat);
				if (ai_chat.done) this.stopChat();
			},
			error: (error) => {
				console.error('ERROR IN COMPONENT', error);
				this.stopChat();
			}
		});
	}

	public stopChat(): void {
		this.aiService.unsubscribeFromAiChat();
		if( !this.chat_subscription ) return;
		this.chat_subscription.unsubscribe();
		this.chat_subscription = null;
		this.cdr.detectChanges();
	}

	ngOnDestroy(): void {
		this.stopChat();
	}
}
