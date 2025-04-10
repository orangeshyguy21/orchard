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

	private chat_subscription: Subscription | null = null;

	public content = new FormControl('');

	public get placeholder(): string {
		return this.aiService.active ? 'Generating...' : 'Message agent...';
	}
	public get action_available(): boolean {
		if( this.aiService.active ) return true;
		if( this.content.value ) return true;
		return false;
	}

	constructor(
		public aiService: AiService,
		private cdr: ChangeDetectorRef
	) {}

	public onSubmit(event?: any): void {
		if( event ) event.preventDefault();
		this.startChat();
	}

	private startChat() {
		if( !this.content.value ) return;
		this.chat_subscription = this.aiService.subscribeToAiChat(this.content.value).subscribe({
			next: (ai_chat: OrchardAiChatChunk) => {
				if (ai_chat.done) this.stopChat();
			},
			error: (error) => {
				console.error('ERROR IN COMPONENT', error);
				this.stopChat();
			}
		});
		this.content.reset();
	}

	public stopChat(): void {
		this.aiService.unsubscribeFromAiChat();
		if( !this.chat_subscription ) return;
		this.chat_subscription.unsubscribe();
		this.chat_subscription = null;
		this.cdr.detectChanges();
	}

	public onAction(): void {
		this.aiService.active ? this.stopChat() : this.startChat();
	}

	ngOnDestroy(): void {
		this.stopChat();
	}
}
