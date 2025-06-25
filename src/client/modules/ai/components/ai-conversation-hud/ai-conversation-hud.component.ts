/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
/* Native Dependencies */
import { AiChatConversation } from '@client/modules/ai/classes/ai-chat-conversation.class';

@Component({
	selector: 'orc-ai-conversation-hud',
	standalone: false,
	templateUrl: './ai-conversation-hud.component.html',
	styleUrl: './ai-conversation-hud.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiConversationHudComponent implements OnChanges {

	@Output() toggle = new EventEmitter<void>();

	@Input() conversation!: AiChatConversation | null;
	@Input() message_length!: number | undefined;
	@Input() log_open!: boolean | undefined;

	public engaged: boolean = false;
	
	public get badge_hidden(): boolean {
		if( !this.conversation ) return true;
		if( this.conversation.message_count_assistant === 0 ) return true;
		if( this.engaged ) return true;
		if( this.log_open ) return true;
		return false;
	}

	constructor(
		private cdr: ChangeDetectorRef
	) {}

	ngOnChanges(changes: SimpleChanges): void {
		if( changes['message_length'] ) {
			this.engaged = false;
			this.cdr.detectChanges();
		}
	}

	public toggleLog(): void {
		this.toggle.emit();
		this.engaged = true;
		this.cdr.detectChanges();
	}
}
