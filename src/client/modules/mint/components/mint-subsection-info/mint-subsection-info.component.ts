/* Core Dependencies */
import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, ChangeDetectorRef, WritableSignal, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { toObservable } from '@angular/core/rxjs-interop';
/* Vendor Dependencies */
import { Subscription } from 'rxjs';
/* Application Dependencies */
import { MintService } from '@client/modules/mint/services/mint/mint.service';
import { MintInfoRpc } from '@client/modules/mint/classes/mint-info-rpc.class';
import { AiService } from '@client/modules/ai/services/ai/ai.service';
import { AiChatToolCall } from '@client/modules/ai/classes/ai-chat-chunk.class';
import { EventService } from '@client/modules/event/services/event/event.service';
import { EventData } from '@client/modules/event/classes/event-data.class';
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
		name: new FormControl(null, Validators.maxLength(200)),
		description: new FormControl(),
		icon_url: new FormControl(),
		description_long: new FormControl(),
	});

	private subscriptions: Subscription = new Subscription();
	private active_event: EventData | null = null;
	private dirty_count: WritableSignal<number> = signal(0);
	private dirty_count$ = toObservable(this.dirty_count);

	constructor(
		public mintService: MintService,
		public route: ActivatedRoute,
		public aiService: AiService,
		public eventService: EventService,
		public cdr: ChangeDetectorRef
	) {}

	async ngOnInit(): Promise<void> {
		this.aiService.active_agent = AiAgent.MintInfo;
		this.init_info = this.route.snapshot.data['mint_info_rpc'];
		this.form_info.setValue({
			name: this.init_info.name,
			description: this.init_info.description,
			icon_url: this.init_info.icon_url,
			description_long: this.init_info.description_long,
		});
		const tool_subscription = this.getToolSubscription();
		const event_subscription = this.getEventSubscription();
		const form_subscription = this.getFormSubscription();
		const dirty_count_subscription = this.getDirtyCountSubscription();
		this.subscriptions.add(tool_subscription);	
		this.subscriptions.add(event_subscription);
		this.subscriptions.add(form_subscription);
		this.subscriptions.add(dirty_count_subscription);
	}

	private getToolSubscription(): Subscription {
		return this.aiService.tool_calls$
			.subscribe((tool_call: AiChatToolCall) => {
				this.executeAgentFunction(tool_call);
			});
	}

	private getEventSubscription(): Subscription {
		return this.eventService.getActiveEvent()
			.subscribe((event_data: EventData | null) => {
				this.active_event = event_data;
				if( event_data?.confirmed ) this.onConfirmedEvent();
			});
	}

	private getFormSubscription(): Subscription {
		return this.form_info.valueChanges.subscribe(() => {
			const count = Object.keys(this.form_info.controls).filter(key => this.form_info.get(key)?.dirty).length;
			this.dirty_count.set(count);
			this.cdr.detectChanges();
		});
	}

	private getDirtyCountSubscription(): Subscription {
		return this.dirty_count$.subscribe((count) => {
			this.createPendingEvent(count);
		});
	}

	private executeAgentFunction(tool_call: AiChatToolCall): void {
		if( tool_call.function.name === AiFunctionName.MintNameUpdate ) {
			this.form_info.get('name')?.setValue(tool_call.function.arguments.name);
			this.form_info.get('name')?.markAsDirty();
			this.cdr.detectChanges();
		}
	}

	private createPendingEvent(count: number): void {
		if( count === 0 && this.active_event?.type !== 'PENDING' ) return;
		if( count === 0 ) return this.eventService.registerEvent(null);
		this.eventService.registerEvent(new EventData({
			type: 'PENDING',
			message: count.toString(),
		}));
	}

	public onControlUpdate(control_name: keyof MintInfoRpc): void {
		if( this.form_info.get(control_name)?.invalid ) return;
		this.form_info.get(control_name)?.markAsPristine();
		const control_value = this.form_info.get(control_name)?.value;
		this.eventService.registerEvent(new EventData({type: 'SAVING'}));
		if( control_name === 'name' ) return this.updateMintName(control_value);
		if( control_name === 'description' ) return this.updateMintDescription(control_value);
		if( control_name === 'icon_url' ) return this.updateMintIcon(control_value);
	}

	private onConfirmedEvent(): void {
		if( this.form_info.invalid ) return;
		this.eventService.registerEvent(new EventData({type: 'SAVING'}));

		// loop every dirty control
		// for( const control_name of Object.keys(this.form_info.controls) ) {
		// 	if( this.form_info.get(control_name)?.dirty ) {
		// 		this.updateMintName(this.form_info.get(control_name)?.value);
		// 	}
		// }



		// this.form_info.get('name')?.markAsPristine();
		// this.mintService.updateMintName(this.form_info.get('name')?.value).subscribe((response) => {
		// 	this.init_info.name = response.mint_name_update.name ?? null;
		// 	this.mintService.clearInfoCache();
		// 	this.mintService.loadMintInfo().subscribe();
		// 	this.eventService.registerEvent(new EventData({type: 'SUCCESS'}));
		// 	this.resetForm();
		// });
	}

	private updateMintInfo() : void {
		// todo
	}

	private updateMintName(control_value: string): void {
		this.mintService.updateMintName(control_value).subscribe({
			next: (response) => {
				this.init_info.name = response.mint_name_update.name ?? null;
				this.onSuccess();
			},
			error: (error) => {
				this.onError(error.message);
			}
		});
	}

	private updateMintDescription(control_value: string): void {
		this.mintService.updateMintDescription(control_value).subscribe({
			next: (response) => {
				this.init_info.description = response.mint_short_description_update.description ?? null;
				this.onSuccess();
			},
			error: (error) => {
				this.onError(error.message);
			}
		});
	}

	private updateMintIcon(control_value: string): void {
		this.mintService.updateMintIcon(control_value).subscribe({
			next: (response) => {
				this.init_info.icon_url = response.mint_icon_update.icon_url ?? null;
				this.cdr.detectChanges();
				this.onSuccess();
			},
			error: (error) => {
				this.onError(error.message);
			}
		});
	}

	private onSuccess(): void {
		this.mintService.clearInfoCache();
		this.mintService.loadMintInfo().subscribe();
		this.eventService.registerEvent(new EventData({type: 'SUCCESS'}));
		this.form_info.markAsPristine();
		this.dirty_count.set(0);
	}

	private onError(error: string): void {
		this.eventService.registerEvent(new EventData({
			type: 'ERROR',
			message: error
		}));
	}

	public onControlCancel(control_name: keyof MintInfoRpc): void {
		if(!control_name) return;
		this.form_info.get(control_name)?.markAsPristine();
		this.form_info.get(control_name)?.setValue(this.init_info[control_name]);
	}

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}
}