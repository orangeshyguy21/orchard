/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Input, ChangeDetectorRef, OnChanges, SimpleChanges} from '@angular/core';
import {trigger, transition, style, animate, state} from '@angular/animations';
/* Vendor Dependencies */
import {marked} from 'marked';
/* Native Dependencies */
import {AiChatCompiledMessage} from '@client/modules/ai/classes/ai-chat-compiled-message.class';
import {AiAgentDefinition} from '@client/modules/ai/classes/ai-agent-definition.class';
/* Shared Dependencies */
import {AiMessageRole} from '@shared/generated.types';

@Component({
	selector: 'orc-ai-chat-message-assistant',
	standalone: false,
	templateUrl: './ai-chat-message-assistant.component.html',
	styleUrl: './ai-chat-message-assistant.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	// prettier-ignore
	animations: [
		trigger('expandCollapse', [
            state('collapsed', style({
                height: '0',
                overflow: 'hidden',
                opacity: 0,
            })),
            state('expanded', style({
                height: '*',
                overflow: 'visible',
                opacity: 1,
            })),
            transition('collapsed <=> expanded', [
                animate('300ms ease-in-out'),
            ]),
        ]),
    ],
})
export class AiChatMessageAssistantComponent implements OnChanges {
	@Input() public message!: AiChatCompiledMessage;
	@Input() public revision!: number;
	@Input() public agent!: AiAgentDefinition | null;
	@Input() public active_chat!: boolean;
	@Input() public index!: number;
	@Input() public conversation_length!: number | undefined;

	public tool_roll = AiMessageRole.Function;
	public marked_content!: string;
	public marked_thinking_content!: string;
	public think_duration!: number;
	public think_expanded: boolean = false;

	public get thinking_complete(): boolean {
		return this.message.done || !this.active_chat || this.think_end > 0 || !this.last_message;
	}

	public get last_message(): boolean {
		if (!this.conversation_length) return false;
		return this.index === this.conversation_length - 1;
	}

	private think_start!: number;
	private think_end!: number;

	constructor(private readonly cdr: ChangeDetectorRef) {}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['revision']) this.parseRawContent();
	}

	private async parseRawContent(): Promise<void> {
		if (this.message.thinking) return this.parseNewThinkingContent();
		return this.parseLegacyThinkingContent();
	}

	private async parseNewThinkingContent(): Promise<void> {
		if (!this.message?.thinking) return;
		if (!this.think_start) this.think_start = Date.now();
		this.marked_thinking_content = await this.updateMarkedContent(this.message.thinking);
		this.marked_content = await this.updateMarkedContent(this.message.content);
		if (this.message.done) {
			this.think_end = Date.now();
			this.finalizeMessage();
		}
	}

	private async parseLegacyThinkingContent(): Promise<void> {
		if (!this.message?.content) return;
		const content = this.message.content;
		const think_start = content.indexOf('<think>');
		if (think_start === -1) {
			this.marked_content = await this.updateMarkedContent(content);
			return;
		}
		if (!this.think_start) this.think_start = Date.now();
		const think_end = content.indexOf('</think>', think_start);
		if (think_end === -1) {
			this.marked_thinking_content = await this.updateMarkedContent(content.substring(think_start + 7));
			return;
		}
		if (!this.think_end) this.think_end = Date.now();
		this.marked_thinking_content = await this.updateMarkedContent(content.substring(think_start + 7, think_end));
		this.marked_content = await this.updateMarkedContent(content.substring(think_end + 8));
		if (this.message.done) this.finalizeMessage();
	}

	private finalizeMessage(): void {
		this.think_duration = this.think_end - this.think_start;
		this.cdr.markForCheck();
	}

	private async updateMarkedContent(content: string): Promise<string> {
		const marked_content = await marked.parse(content);
		this.cdr.markForCheck();
		return marked_content;
	}

	public toggleThinking(): void {
		this.think_expanded = !this.think_expanded;
		this.cdr.detectChanges();
	}
}
