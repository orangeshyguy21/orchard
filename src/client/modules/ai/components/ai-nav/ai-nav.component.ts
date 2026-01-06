/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
import {FormControl} from '@angular/forms';
/* Native Dependencies */
import {AiService} from '@client/modules/ai/services/ai/ai.service';
import {AiModel} from '@client/modules/ai/classes/ai-model.class';
import {AiChatConversation} from '@client/modules/ai/classes/ai-chat-conversation.class';
/* Shared Dependencies */
import {AiAgent} from '@shared/generated.types';

@Component({
	selector: 'orc-ai-nav',
	standalone: false,
	templateUrl: './ai-nav.component.html',
	styleUrl: './ai-nav.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[class.collapsed]': '!opened()',
	},
})
export class AiNavComponent {
	/* Inputs */
	public active_agent = input.required<AiAgent>();
	public active_chat = input.required<boolean>();
	public model = input.required<string | null>();
	public model_options = input.required<AiModel[]>();
	public actionable = input.required<boolean>();
	public content = input.required<FormControl>();
	public conversation = input.required<AiChatConversation | null>();
	public message_length = input<number>();
	public tool_length = input.required<number>();
	public log_open = input<boolean>();
	public opened = input<boolean>(false);

	/* Outputs */
	public command = output<void>();
	public modelChange = output<string>();
	public toggleLog = output<void>();

	constructor(private aiService: AiService) {}

	/**
	 * Handles the command action - starts or stops chat based on current state
	 */
	public onCommand(): void {
		this.active_chat() ? this.stopChat() : this.startChat();
	}

	/**
	 * Initiates a chat request with the AI service
	 */
	private startChat(): void {
		if (!this.content().value) return;
		const agent = this.active_agent() || AiAgent.Default;
		this.aiService.requestAgent(agent, this.content().value);
		this.content().reset();
	}

	/**
	 * Aborts the current AI chat session
	 */
	public stopChat(): void {
		this.aiService.abortAiSocket();
	}
}
