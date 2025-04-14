/* Core Dependencies */
import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
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

	private tool_subscription?: Subscription;

	constructor(
		public mintService: MintService,
		public route: ActivatedRoute,
		public aiService: AiService,
	) {}

	async ngOnInit(): Promise<void> {
		this.aiService.active_agent = AiAgent.MintInfo;
		this.init_info = this.route.snapshot.data['mint_info_rpc'];
		this.tool_subscription = this.aiService.tool_calls
			.subscribe((tool_call: AiChatToolCall) => {
				console.log('tool_call', tool_call);
				if( tool_call.function.name === AiFunctionName.MintNameUpdate ) {
					console.log('HOLY SHIT DO THE THING');
				}
			});
	}

	ngOnDestroy(): void {
		this.tool_subscription?.unsubscribe();
	}
}