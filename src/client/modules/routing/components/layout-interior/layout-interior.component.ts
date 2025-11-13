/* Core Dependencies */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, signal} from '@angular/core';
import {Event, Router, ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';
import {FormControl} from '@angular/forms';
/* Vendor Dependencies */
import {Subscription, timer, EMPTY} from 'rxjs';
import {switchMap, catchError, filter, takeWhile} from 'rxjs/operators';
import {MatSidenav} from '@angular/material/sidenav';
/* Application Dependencies */
import {ConfigService} from '@client/modules/config/services/config.service';
import {CrewService} from '@client/modules/crew/services/crew/crew.service';
import {SettingDeviceService} from '@client/modules/settings/services/setting-device/setting-device.service';
import {BitcoinService} from '@client/modules/bitcoin/services/bitcoin/bitcoin.service';
import {LightningService} from '@client/modules/lightning/services/lightning/lightning.service';
import {MintService} from '@client/modules/mint/services/mint/mint.service';
import {AiService} from '@client/modules/ai/services/ai/ai.service';
import {EventService} from '@client/modules/event/services/event/event.service';
import {ChartService} from '@client/modules/chart/services/chart/chart.service';
import {EventData} from '@client/modules/event/classes/event-data.class';
import {User} from '@client/modules/crew/classes/user.class';
import {BitcoinBlockchainInfo} from '@client/modules/bitcoin/classes/bitcoin-blockchain-info.class';
import {BitcoinBlockCount} from '@client/modules/bitcoin/classes/bitcoin-blockcount.class';
import {LightningInfo} from '@client/modules/lightning/classes/lightning-info.class';
import {MintInfo} from '@client/modules/mint/classes/mint-info.class';
import {AiChatChunk} from '@client/modules/ai/classes/ai-chat-chunk.class';
import {AiModel} from '@client/modules/ai/classes/ai-model.class';
import {AiChatConversation} from '@client/modules/ai/classes/ai-chat-conversation.class';
import {AiChatCompiledMessage} from '@client/modules/ai/classes/ai-chat-compiled-message.class';
import {AiAgentDefinition} from '@client/modules/ai/classes/ai-agent-definition.class';
/* Shared Dependencies */
import {AiAgent, AiMessageRole} from '@shared/generated.types';

@Component({
	selector: 'orc-layout-interior',
	standalone: false,
	templateUrl: './layout-interior.component.html',
	styleUrl: './layout-interior.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutInteriorComponent implements OnInit, OnDestroy {
	@ViewChild(MatSidenav) sidenav!: MatSidenav;

	public user_name!: string;
	public ai_enabled: boolean;
	public ai_models: AiModel[] = [];
	public ai_conversation: AiChatConversation | null = null;
	public ai_revision: number = 0;
	public ai_tool_calls: number = 0;
	public active_chat!: boolean;
	public active_section!: string;
	public active_agent!: AiAgent;
	public active_event!: EventData | null;
	public model!: string | null;
	public user_content = new FormControl('');
	public enabled_bitcoin: boolean;
	public enabled_lightning: boolean;
	public enabled_mint: boolean;
	public online_bitcoin!: boolean;
	public online_lightning!: boolean;
	public online_mint!: boolean;
	public syncing_bitcoin!: boolean;
	public syncing_lightning!: boolean;
	public block_count!: number;

	// public ai_agent_definition: AiAgentDefinition | null = null;
	public ai_agent_definition = signal<AiAgentDefinition | null>(null);

	public get ai_actionable(): boolean {
		if (this.active_chat) return true;
		if (this.user_content.value) return true;
		return false;
	}

	private subscriptions: Subscription = new Subscription();
	private bitcoin_polling_active: boolean = false;

	constructor(
		private configService: ConfigService,
		private crewService: CrewService,
		private settingDeviceService: SettingDeviceService,
		private bitcoinService: BitcoinService,
		private lightningService: LightningService,
		private mintService: MintService,
		private aiService: AiService,
		private eventService: EventService,
		private chartService: ChartService,
		private router: Router,
		private route: ActivatedRoute,
		private cdr: ChangeDetectorRef,
	) {
		this.ai_enabled = this.configService.config.ai.enabled;
		this.enabled_bitcoin = this.configService.config.bitcoin.enabled;
		this.enabled_lightning = this.configService.config.lightning.enabled;
		this.enabled_mint = this.configService.config.mint.enabled;
	}

	/* *******************************************************
	   Initalization                      
	******************************************************** */

	ngOnInit(): void {
		this.crewService.loadUser().subscribe();
		this.subscriptions.add(this.getRouterSubscription());
		this.subscriptions.add(this.getEventSubscription());
		this.subscriptions.add(this.getUserSubscription());
		this.orchardOptionalInit();
	}

	private orchardOptionalInit(): void {
		if (this.enabled_bitcoin) {
			this.bitcoin_polling_active = true;
			this.bitcoinService.loadBitcoinBlockchainInfo().subscribe();
			this.subscriptions.add(this.getBitcoinBlockchainInfoSubscription());
			this.subscriptions.add(this.getBitcoinBlockCountSubscription());
		}
		if (this.enabled_lightning) {
			this.lightningService.loadLightningInfo().subscribe();
			this.subscriptions.add(this.getLightningInfoSubscription());
		}
		if (this.enabled_mint) {
			this.mintService.loadMintInfo().subscribe();
			this.subscriptions.add(this.getMintInfoSubscription());
		}
		// if taproot go get the ids
		if (this.ai_enabled) {
			this.subscriptions.add(this.getAgentSubscription());
			this.subscriptions.add(this.getActiveAiSubscription());
			this.subscriptions.add(this.getAiMessagesSubscription());
			this.subscriptions.add(this.getAiConversationSubscription());
			this.model = this.settingDeviceService.getModel();
			if (!this.model) {
				this.aiService.getFunctionModel().subscribe((model) => {
					this.model = model?.model || null;
					this.settingDeviceService.setModel(this.model);
					this.cdr.detectChanges();
				});
			}
			this.getModels();
		}
	}

	/* *******************************************************
		Subscriptions                      
	******************************************************** */

	private getRouterSubscription(): Subscription {
		return this.router.events.pipe(filter((event: Event) => 'routerEvent' in event || 'type' in event)).subscribe((event) => {
			const route_data = this.getRouteData(event);
			this.setSection(route_data);
			this.setAgent(route_data);
			this.onClearConversation();
		});
	}

	private getUserSubscription(): Subscription {
		return this.crewService.user$.subscribe({
			next: (user: User | null) => {
				if (user === undefined || user === null) return;
				this.user_name = user.name;
				this.cdr.detectChanges();
			},
			error: (error) => {
				console.error(error);
				this.user_name = '';
				this.cdr.detectChanges();
			},
		});
	}

	private getBitcoinBlockchainInfoSubscription(): Subscription {
		return this.bitcoinService.bitcoin_blockchain_info$.subscribe({
			next: (info: BitcoinBlockchainInfo | null) => {
				if (info === undefined) return;
				this.online_bitcoin = info !== null ? true : false;
				this.syncing_bitcoin = info?.initialblockdownload ? true : false;
				this.cdr.detectChanges();
			},
			error: (error) => {
				console.error(error);
				this.online_bitcoin = false;
				this.cdr.detectChanges();
			},
		});
	}

	private getBitcoinBlockCountSubscription(): Subscription {
		return timer(0, 60000)
			.pipe(
				takeWhile(() => this.bitcoin_polling_active),
				switchMap(() =>
					this.bitcoinService.getBlockCount().pipe(
						catchError((error) => {
							console.error('Failed to fetch block count, polling stopped:', error);
							this.bitcoin_polling_active = false;
							return EMPTY;
						}),
					),
				),
			)
			.subscribe({
				next: async (block_count: BitcoinBlockCount) => {
					this.block_count = block_count.height;
					this.cdr.detectChanges();
				},
			});
	}

	private getLightningInfoSubscription(): Subscription {
		return this.lightningService.lightning_info$.subscribe({
			next: (info: LightningInfo | null) => {
				if (info === undefined) return;
				this.online_lightning = info !== null ? true : false;
				this.syncing_lightning = info?.synced_to_chain && info?.synced_to_graph ? false : true;
				this.cdr.detectChanges();
			},
			error: (error) => {
				console.error(error);
				this.online_lightning = false;
				this.cdr.detectChanges();
			},
		});
	}

	private getMintInfoSubscription(): Subscription {
		return this.mintService.mint_info$.subscribe({
			next: (info: MintInfo | null) => {
				if (info === undefined) return;
				this.online_mint = info !== null ? true : false;
				this.cdr.detectChanges();
			},
			error: (error) => {
				console.error(error);
				this.online_mint = false;
				this.cdr.detectChanges();
			},
		});
	}

	private getAgentSubscription(): Subscription {
		return this.aiService.agent_requests$.subscribe(({agent, content}) => {
			if (agent === AiAgent.Default) this.aiService.openAiSocket(agent, content);
		});
	}

	private getActiveAiSubscription(): Subscription {
		return this.aiService.active$.subscribe((active: boolean) => {
			this.active_chat = active;
			this.cdr.detectChanges();
		});
	}

	private getAiMessagesSubscription(): Subscription {
		return this.aiService.messages$.subscribe((chunk: AiChatChunk) => {
			this.assembleMessages(chunk);
			this.countToolCalls(chunk);
			if (chunk.done && this.ai_conversation) this.aiService.updateConversation(this.ai_conversation);
		});
	}

	private getAiConversationSubscription(): Subscription {
		return this.aiService.conversation$.subscribe((conversation: AiChatConversation | null) => {
			this.ai_conversation = conversation;
			this.ai_revision = 0;
			this.cdr.detectChanges();
		});
	}

	private getEventSubscription(): Subscription {
		return this.eventService.getActiveEvent().subscribe((event_data: EventData | null) => {
			this.active_event = event_data;
			if (this.active_section === 'settings') this.model = this.settingDeviceService.getModel();
			this.cdr.detectChanges();
		});
	}

	/* *******************************************************
	   Events                      
	******************************************************** */

	public onSavePendingEvent(): void {
		this.active_event!.confirmed = true;
		this.eventService.registerEvent(this.active_event);
	}

	public onCancelPendingEvent(): void {
		this.active_event!.confirmed = false;
		this.eventService.registerEvent(this.active_event);
	}

	/* *******************************************************
	   Routing                      
	******************************************************** */

	private getRouteData(event: Event): ActivatedRouteSnapshot['data'] | null {
		const router_event = 'routerEvent' in event ? event.routerEvent : event;
		if (router_event.type !== 1) return null;
		let route = this.route.root;
		while (route.firstChild) {
			route = route.firstChild;
		}
		return route.snapshot.data;
	}

	private setSection(route_data: ActivatedRouteSnapshot['data'] | null): void {
		if (!route_data) return;
		this.active_section = route_data['section'] || '';
		this.cdr.detectChanges();
	}

	/* *******************************************************
	   Agent                      
	******************************************************** */

	private setAgent(route_data: ActivatedRouteSnapshot['data'] | null): void {
		if (!route_data) return;
		this.active_agent = route_data['agent'] || AiAgent.Default;
		this.cdr.detectChanges();
	}

	private getModels(): void {
		this.aiService.getAiModels().subscribe((models: AiModel[]) => {
			this.ai_models = models;
			this.cdr.detectChanges();
		});
	}

	public onCommand(): void {
		this.active_chat ? this.stopChat() : this.startChat();
	}

	public onToggleLog(): void {
		this.sidenav.opened ? this.closeChatLog() : this.openChatLog();
		this.chartService.triggerResizeStart();
		setTimeout(() => {
			this.chartService.triggerResizeEnd();
		}, 400);
	}

	private startChat() {
		if (!this.user_content.value) return;
		const agent = this.active_agent || AiAgent.Default;
		this.aiService.requestAgent(agent, this.user_content.value);
		this.user_content.reset();
	}

	public stopChat(): void {
		this.aiService.closeAiSocket();
		if (this.ai_conversation) this.aiService.updateConversation(this.ai_conversation);
		this.cdr.detectChanges();
	}

	public onModelChange(model: string): void {
		this.eventService.registerEvent(new EventData({type: 'SAVING'}));
		this.settingDeviceService.setModel(model);
		this.model = model;
		this.eventService.registerEvent(
			new EventData({
				type: 'SUCCESS',
				message: 'Model updated!',
			}),
		);
		this.cdr.detectChanges();
	}

	public onClearConversation(): void {
		this.closeChatLog();
		this.aiService.clearConversation();
		this.ai_tool_calls = 0;
		this.cdr.detectChanges();
	}

	private assembleMessages(chunk: AiChatChunk): void {
		if (
			this.ai_conversation!.messages.length > 0 &&
			this.ai_conversation!.messages[this.ai_conversation!.messages.length - 1].role !== AiMessageRole.Assistant
		) {
			this.ai_conversation!.messages.push(new AiChatCompiledMessage(this.ai_conversation!.id, chunk.message));
		} else {
			const last_message = this.ai_conversation!.messages[this.ai_conversation!.messages.length - 1];
			last_message.integrateChunk(chunk);
		}
		this.ai_revision++;
		this.cdr.detectChanges();
	}

	private countToolCalls(chunk: AiChatChunk): void {
		this.ai_tool_calls += chunk.message.tool_calls?.length || 0;
		this.cdr.detectChanges();
	}

	private openChatLog(): void {
		this.sidenav.open();
		const resolved_agent = this.ai_conversation?.agent || this.active_agent;
		this.aiService.getAiAgent(resolved_agent).subscribe((agent: AiAgentDefinition) => {
			this.ai_agent_definition.set(agent);
		});
	}
	private closeChatLog(): void {
		this.sidenav.close();
	}

	/* *******************************************************
	   Destroy                      
	******************************************************** */

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}
}
