/* Core Dependencies */
import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, ChangeDetectorRef, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { trigger, style, animate, transition } from '@angular/animations';
/* Vendor Dependencies */
import { Subscription } from 'rxjs';
/* Native Dependencies */
import { AiService } from '@client/modules/ai/services/ai/ai.service';
import { AiChatChunk } from '@client/modules/ai/classes/ai-chat-chunk.class';
/* Shared Dependencies */
import { AiAgent } from '@shared/generated.types';

@Component({
	selector: 'orc-ai-input',
	standalone: false,
	templateUrl: './ai-input.component.html',
	styleUrl: './ai-input.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('iconAnimation', [
			transition('* => *', [
				style({ transform: 'scale(0.8)', opacity: 0.5 }),
				animate('200ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
			])
		])
	]
})
export class AiInputComponent implements OnInit, OnDestroy {

	@Input() active_agent!: AiAgent;

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

	ngOnInit(): void {
		this.chat_subscription = this.aiService.messages$
			.subscribe((chunk: AiChatChunk) => {
				if( chunk.done ){
					setTimeout(() => {
						this.cdr.detectChanges();
					});
				}
			});
	}

	public onSubmit(event?: any): void {
		if( event ) event.preventDefault();
		this.startChat();
	}

	private startChat() {
		if( !this.content.value ) return;
		const agent = this.active_agent || AiAgent.Default;
		this.aiService.requestAgent(agent, this.content.value);
		this.content.reset();
	}

	public stopChat(): void {
		this.aiService.closeAiSocket();
		this.cdr.detectChanges();
	}

	public onAction(): void {
		this.aiService.active ? this.stopChat() : this.startChat();
	}

	ngOnDestroy(): void {
		this.chat_subscription?.unsubscribe();
	}
}
