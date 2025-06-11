/* Core Dependencies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Event, Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { FormControl } from '@angular/forms';
/* Vendor Dependencies */
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
/* Application Configuration */
import { environment } from '@client/configs/configuration';
/* Application Dependencies */
import { SettingService } from '@client/modules/settings/services/setting/setting.service';
import { BitcoinService } from '@client/modules/bitcoin/services/bitcoin.service';
import { LightningService } from '@client/modules/lightning/services/lightning/lightning.service';
import { MintService } from '@client/modules/mint/services/mint/mint.service';
import { AiService } from '@client/modules/ai/services/ai/ai.service';
import { EventService } from '@client/modules/event/services/event/event.service';
import { EventData } from '@client/modules/event/classes/event-data.class';
import { BitcoinInfo } from '@client/modules/bitcoin/classes/bitcoin-info.class';
import { LightningInfo } from '@client/modules/lightning/classes/lightning-info.class';
import { MintInfo } from '@client/modules/mint/classes/mint-info.class';
import { AiChatChunk } from '@client/modules/ai/classes/ai-chat-chunk.class';
import { AiModel } from '@client/modules/ai/classes/ai-model.class';
/* Shared Dependencies */
import { AiAgent } from '@shared/generated.types';

@Component({
	selector: 'orc-layout-interior',
	standalone: false,
	templateUrl: './layout-interior.component.html',
	styleUrl: './layout-interior.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutInteriorComponent implements OnInit, OnDestroy {

	public ai_enabled = environment.ai.enabled;
	public ai_models: AiModel[] = [];
	public active_chat!: boolean;
	public active_section! : string;
	public active_agent! : AiAgent;
	public model!: string | null;
	public user_content = new FormControl('');
	public enabled_bitcoin = environment.bitcoin.enabled;
	public enabled_lightning = environment.lightning.enabled;
	public enabled_mint = environment.mint.enabled;

	public get ai_actionable(): boolean {
		if( this.active_chat ) return true;
		if( this.user_content.value ) return true;
		return false;
	}
	
	private subscriptions: Subscription = new Subscription();
	private event_subscription!: Subscription | undefined;

	constructor(
		private settingService: SettingService,
		private bitcoinService: BitcoinService,
		private lightningService: LightningService,
		private mintService: MintService,
		private aiService: AiService,
		private eventService: EventService,
		private router: Router,
		private route: ActivatedRoute,
		private cdr: ChangeDetectorRef,
	) {

	}

	/* *******************************************************
	   Initalization                      
	******************************************************** */

	ngOnInit(): void {
		const router_subscription = this.getRouterSubscription();
		this.subscriptions.add(router_subscription);
		this.model = this.settingService.getModel();
		this.orchardOptionalInit();
	}

	private orchardOptionalInit(): void {
		if( this.enabled_bitcoin ) {
			this.bitcoinService.loadBitcoinInfo().subscribe();
			this.subscriptions.add(this.getBitcoinInfoSubscription());
		}
		if( this.enabled_lightning ) {
			this.lightningService.loadLightningInfo().subscribe();
			this.subscriptions.add(this.getLightningInfoSubscription());
		}
		if( this.enabled_mint ) {
			this.mintService.loadMintInfo().subscribe();
			this.subscriptions.add(this.getMintInfoSubscription());
		}
		if( environment.ai.enabled ) {
			this.subscriptions.add(this.getAgentSubscription());
			this.subscriptions.add(this.getActiveAiSubscription());
			this.subscriptions.add(this.getAiMessagesSubscription());
			this.getModels();
		}
	}

	/* *******************************************************
		Subscriptions                      
	******************************************************** */

	private getRouterSubscription(): Subscription {
		return this.router.events
			.pipe(
				filter((event: Event) => 'routerEvent' in event || 'type' in event)
			)
			.subscribe(event => {
				const route_data = this.getRouteData(event);
				this.setSection(route_data);
				this.setAgent(route_data);
				this.active_section === 'settings' ? this.eventInit() : this.eventDestroy();
			});
	}

	private getBitcoinInfoSubscription(): Subscription {
		return this.bitcoinService.bitcoin_info$.subscribe(
            (info:BitcoinInfo | null) => {
				console.log('bitcoin info', info);
				// enaluavte the state of the bitcoin node 
            }
        );
	}

	private getLightningInfoSubscription(): Subscription {
		return this.lightningService.lightning_info$.subscribe(
            (info:LightningInfo | null) => {
				console.log('lightning info', info);
				// evaluate the state of the lightning node
            }
        );
	}

	private getMintInfoSubscription(): Subscription {	
		return this.mintService.mint_info$.subscribe(
            (info:MintInfo | null) => {
				console.log('mint info', info);
				// evaluate the state of the cashu mint
            }
        );
	}

	private getAgentSubscription(): Subscription {
		return this.aiService.agent_requests$
			.subscribe(({ agent, content }) => {
				if( agent === AiAgent.Default ) this.aiService.openAiSocket(agent, content);
			});
	}

	private getActiveAiSubscription(): Subscription {
		return this.aiService.active$
			.subscribe((active: boolean) => {
				this.active_chat = active;
				this.cdr.detectChanges();
			});
	}

	private getAiMessagesSubscription(): Subscription {
		return this.aiService.messages$
			.subscribe((chunk: AiChatChunk) => {
				console.log('ai chunk', chunk);
				// @todo create messages
			});
	}

	private getEventSubscription(): Subscription {
		return this.eventService.getActiveEvent()
			.subscribe((event_data: EventData | null) => {
				console.log('EVENT LISTENER IN INTERIOR LAYOUT', event_data);
				this.model = this.settingService.getModel();
				this.cdr.detectChanges();
			});
	}

	/* *******************************************************
	   Events                      
	******************************************************** */
		
	private eventInit(): void {
		if( this.event_subscription ) return;
		this.event_subscription = this.getEventSubscription();
	}
	private eventDestroy(): void {
		if( !this.event_subscription ) return;
		this.event_subscription.unsubscribe();
		this.event_subscription = undefined;
	}

	/* *******************************************************
	   Routing                      
	******************************************************** */

	private getRouteData(event: Event): ActivatedRouteSnapshot['data'] | null {
		const router_event = 'routerEvent' in event ? event.routerEvent : event;
		if( router_event.type !== 1 ) return null;
		let route = this.route.root;
		while (route.firstChild) {
			route = route.firstChild;
		}
		return route.snapshot.data;
	}

	private setSection(route_data: ActivatedRouteSnapshot['data'] | null): void {
		if( !route_data ) return;
		this.active_section = route_data['section'] || '';
		this.cdr.detectChanges();
	}

	/* *******************************************************
	   Agent                      
	******************************************************** */

	private setAgent(route_data: ActivatedRouteSnapshot['data'] | null): void {
		if( !route_data ) return;
		this.active_agent = route_data['agent'] || '';
		this.cdr.detectChanges();
	}

	private getModels(): void {
		this.aiService.getAiModels()
			.subscribe((models:AiModel[]) => {
				this.ai_models = models;
				this.cdr.detectChanges();
			}
		);
	}

	public onCommand(): void {
		this.active_chat ? this.stopChat() : this.startChat();
	}

	private startChat() {
		if( !this.user_content.value ) return;
		const agent = this.active_agent || AiAgent.Default;
		this.aiService.requestAgent(agent, this.user_content.value);
		this.user_content.reset();
	}

	public stopChat(): void {
		this.aiService.closeAiSocket();
		this.cdr.detectChanges();
	}

	public onModelChange(model: string): void {
		this.eventService.registerEvent(new EventData({type: 'SAVING'}));
		this.settingService.setModel(model);
		this.model = model;
		this.eventService.registerEvent(new EventData({type: 'SUCCESS'}));
		this.cdr.detectChanges();
	}

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}
}