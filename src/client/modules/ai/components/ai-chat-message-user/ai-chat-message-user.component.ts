/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, signal, OnInit} from '@angular/core';
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
	public message = input.required<AiChatCompiledMessage>();
	public user_name = input.required<string>();

	public marked_content = signal<string>('');

	async ngOnInit(): Promise<void> {
		this.marked_content.set(await marked.parse(this.message().content));
	}
}
