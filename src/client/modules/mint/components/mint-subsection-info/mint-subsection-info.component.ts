/* Core Dependencies */
import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
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
	public form_info: FormGroup = new FormGroup({
		name: new FormControl(),
		description: new FormControl(),
		icon_url: new FormControl(),
	});

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
		this.form_info.setValue({
			name: this.init_info.name,
			description: this.init_info.description,
			icon_url: this.init_info.icon_url,
		});
		this.tool_subscription = this.aiService.tool_calls$
			.subscribe((tool_call: AiChatToolCall) => {
				this.executeAgentFunction(tool_call);
			});
	}

	private executeAgentFunction(tool_call: AiChatToolCall): void {
		if( tool_call.function.name === AiFunctionName.MintNameUpdate ) {
			this.form_info.get('name')?.setValue(tool_call.function.arguments.name);
			this.form_info.get('name')?.markAsDirty();
			this.cdr.detectChanges();
		}
	}

	public onControlUpdate(control_name: string): void {
		if(!control_name) return;
		this.form_info.get(control_name)?.markAsPristine();
		const control_value = this.form_info.get(control_name)?.value;
		this.mintService.updateMintName(control_value).subscribe((response) => {
			this.init_info.name = response.mint_name_update.name;
			this.mintService.clearInfoCache();
			this.mintService.loadMintInfo().subscribe();
		});
	}

	public onControlCancel(control_name: keyof MintInfoRpc): void {
		if(!control_name) return;
		this.form_info.get(control_name)?.markAsPristine();
		this.form_info.get(control_name)?.setValue(this.init_info[control_name]);
	}

	ngOnDestroy(): void {
		this.tool_subscription?.unsubscribe();
	}
}