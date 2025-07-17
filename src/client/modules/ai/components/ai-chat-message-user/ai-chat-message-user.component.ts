/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Input, OnInit, ChangeDetectorRef} from '@angular/core';
/* Vendor Dependencies */
import {marked} from 'marked';
/* Native Dependencies */
import {AiChatCompiledMessage} from '@client/modules/ai/classes/ai-chat-compiled-message.class';

@Component({
	selector: 'orc-ai-chat-message-user',
	standalone: false,
	templateUrl: './ai-chat-message-user.component.html',
	styleUrl: './ai-chat-message-user.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiChatMessageUserComponent implements OnInit {
	@Input() public message!: AiChatCompiledMessage;

	public marked_content!: string;

	constructor(private readonly cdr: ChangeDetectorRef) {}

	async ngOnInit(): Promise<void> {
		this.marked_content = await marked.parse(this.message.content);
		this.cdr.detectChanges();
	}
}
