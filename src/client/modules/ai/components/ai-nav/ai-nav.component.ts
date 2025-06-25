/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
/* Native Dependencies */
import { AiService } from '@client/modules/ai/services/ai/ai.service';
import { AiModel } from '@client/modules/ai/classes/ai-model.class';
import { AiChatConversation } from '@client/modules/ai/classes/ai-chat-conversation.class';
/* Shared Dependencies */
import { AiAgent } from '@shared/generated.types';

@Component({
	selector: 'orc-ai-nav',
	standalone: false,
	templateUrl: './ai-nav.component.html',
	styleUrl: './ai-nav.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiNavComponent {

	@Input() active_agent!: AiAgent;
	@Input() active_chat!: boolean;
	@Input() model!: string | null;
	@Input() model_options!: AiModel[];
	@Input() actionable!: boolean;
	@Input() content!: FormControl;
	@Input() conversation!: AiChatConversation | null;
	@Input() message_length!: number | undefined;

	@Output() command = new EventEmitter<void>();
	@Output() modelChange = new EventEmitter<string>();
	@Output() toggleLog = new EventEmitter<void>();

	constructor(
		public aiService: AiService,
		private cdr: ChangeDetectorRef
	) {}

	// @todo ai service active should probably be an observable
	public onCommand(): void {
		this.active_chat ? this.stopChat() : this.startChat();
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
}

