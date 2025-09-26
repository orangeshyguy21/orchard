/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Input, OnInit, ChangeDetectorRef} from '@angular/core';
import {trigger, state, style, transition, animate} from '@angular/animations';
/* Vendor Dependencies */
import {marked} from 'marked';
/* Native Dependencies */
import {AiChatCompiledMessage} from '@client/modules/ai/classes/ai-chat-compiled-message.class';

@Component({
	selector: 'orc-ai-chat-message-system',
	standalone: false,
	templateUrl: './ai-chat-message-system.component.html',
	styleUrl: './ai-chat-message-system.component.scss',
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
export class AiChatMessageSystemComponent implements OnInit {
	@Input() public message!: AiChatCompiledMessage;

	public marked_content!: string;
	public message_expanded: boolean = false;

	constructor(private readonly cdr: ChangeDetectorRef) {}

	async ngOnInit(): Promise<void> {
		this.marked_content = await marked.parse(this.message.content);
		this.cdr.detectChanges();
	}

	public toggleMessage(): void {
		this.message_expanded = !this.message_expanded;
		this.cdr.detectChanges();
	}
}
