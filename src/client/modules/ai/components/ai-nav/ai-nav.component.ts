/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, OnInit, ChangeDetectorRef, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
/* Vendor Dependencies */
import { Subscription } from 'rxjs';
/* Native Dependencies */
import { AiService } from '@client/modules/ai/services/ai/ai.service';
import { AiChatChunk } from '@client/modules/ai/classes/ai-chat-chunk.class';
/* Shared Dependencies */
import { AiAgent } from '@shared/generated.types';

@Component({
	selector: 'orc-ai-nav',
	standalone: false,
	templateUrl: './ai-nav.component.html',
	styleUrl: './ai-nav.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiNavComponent implements OnInit, OnChanges, OnDestroy {

	public content = new FormControl('');

	@Input() active_agent!: AiAgent;
	@Input() active_chat!: boolean;
	@Input() model!: string | null;

	public get actionable(): boolean {
		if( this.active_chat ) return true;
		if( this.content.value ) return true;
		return false;
	}

	private chat_subscription: Subscription | null = null;

	constructor(
		public aiService: AiService,
		private cdr: ChangeDetectorRef
	) {}

	ngOnInit(): void {
		// @todo get models
		// @todo move this to the layout interior component
		this.chat_subscription = this.aiService.messages$
			.subscribe((chunk: AiChatChunk) => {
				if( !chunk.done ) return;
				setTimeout(() => this.cdr.detectChanges());
			});
	}

	ngOnChanges(changes: SimpleChanges): void {
		if( changes['model'] ) {
			( this.model ) ? this.content.enable() : this.content.disable();
		}
	}

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

	// @todo redundant? could we just use the command emitter?
	public onChat(): void {
		this.startChat();
	}

	ngOnDestroy(): void {
		this.chat_subscription?.unsubscribe();
	}
}

