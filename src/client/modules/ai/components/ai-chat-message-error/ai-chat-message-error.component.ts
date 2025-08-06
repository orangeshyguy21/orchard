/* Core Dependencies */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
/* Vendor Dependencies */
import {marked} from 'marked';
/* Native Dependencies */
import {AiChatCompiledMessage} from '@client/modules/ai/classes/ai-chat-compiled-message.class';

@Component({
	selector: 'orc-ai-chat-message-error',
	standalone: false,
	templateUrl: './ai-chat-message-error.component.html',
	styleUrl: './ai-chat-message-error.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiChatMessageErrorComponent implements OnInit {
	@Input() public message!: AiChatCompiledMessage;

	public marked_content!: string;

	constructor(private readonly cdr: ChangeDetectorRef) {}

	async ngOnInit(): Promise<void> {
		this.marked_content = await marked.parse(this.message.content);
		this.cdr.detectChanges();
	}
}
