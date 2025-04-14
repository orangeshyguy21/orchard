/* Core Dependencies */
import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
/* Vendor Dependencies */
import { Subscription } from 'rxjs';
/* Application Dependencies */
import { MintService } from '@client/modules/mint/services/mint/mint.service';
import { MintInfoRpc } from '@client/modules/mint/classes/mint-info-rpc.class';
import { AiService } from '@client/modules/ai/services/ai/ai.service';
import { AiChatToolCall } from '@client/modules/ai/classes/ai-chat-chunk.class';
/* Shared Dependencies */
import { AiAgent, AiFunctionName } from '@shared/generated.types';

@Component({
	selector: 'orc-mint-subsection-info',
	standalone: false,
	templateUrl: './mint-subsection-info.component.html',
	styleUrl: './mint-subsection-info.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintSubsectionInfoComponent implements OnInit, OnDestroy {

	public init_info!: MintInfoRpc;
	public agent_info: {
		name: string | null;
	} = {
		name: null
	};

	private tool_subscription?: Subscription;

	constructor(
		public mintService: MintService,
		public route: ActivatedRoute,
		public aiService: AiService,
		public cdr: ChangeDetectorRef
	) {}

	async ngOnInit(): Promise<void> {
		this.aiService.active_agent = AiAgent.MintInfo;
		this.init_info = this.route.snapshot.data['mint_info_rpc'];
		this.tool_subscription = this.aiService.tool_calls
			.subscribe((tool_call: AiChatToolCall) => {
				this.executeAgentFunction(tool_call);
			});
	}

	private executeAgentFunction(tool_call: AiChatToolCall): void {
		if( tool_call.function.name === AiFunctionName.MintNameUpdate ) {
			this.agent_info.name = tool_call.function.arguments.name;
			console.log('agent_info', this.agent_info);
			this.cdr.detectChanges();
		}
	}

	public onNameUpdate(name: string|null): void {
		// this.agent_info.name = name;
		// this.cdr.detectChanges();
	}

	ngOnDestroy(): void {
		this.tool_subscription?.unsubscribe();
	}
}