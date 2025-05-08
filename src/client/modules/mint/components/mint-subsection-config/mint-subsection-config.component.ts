/* Core Dependencies */
import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, WritableSignal, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { toObservable } from '@angular/core/rxjs-interop';
import { trigger, transition, style, animate } from '@angular/animations';
/* Vendor Dependencies */
import { Subscription } from 'rxjs';
/* Application Dependencies */
import { EventService } from '@client/modules/event/services/event/event.service';
import { OrchardValidators } from '@client/modules/form/validators';
import { EventData } from '@client/modules/event/classes/event-data.class';
import { AiService } from '@client/modules/ai/services/ai/ai.service';
import { AiChatToolCall } from '@client/modules/ai/classes/ai-chat-chunk.class';
/* Native Dependencies */
import { MintService } from '@client/modules/mint/services/mint/mint.service';
import { MintInfo } from '@client/modules/mint/classes/mint-info.class';
import { MintQuoteTtls } from '@client/modules/mint/classes/mint-quote-ttls.class';
/* Shared Dependencies */
import { OrchardNut4Method, OrchardNut5Method } from '@shared/generated.types';

@Component({
	selector: 'orc-mint-subsection-config',
	standalone: false,
	templateUrl: './mint-subsection-config.component.html',
	styleUrl: './mint-subsection-config.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('fadeInOut', [
			transition(':enter', [
				style({ opacity: 0 }),
				animate('150ms ease-in', style({ opacity: 1 }))
			]),
			transition(':leave', [
				animate('150ms ease-out', style({ opacity: 0 }))
			])
		])
	]
})
export class MintSubsectionConfigComponent implements OnInit, OnDestroy {

	public mint_info: MintInfo | null = null;
	public quote_ttls!: MintQuoteTtls;
	public minting_units: string[] = [];
	public melting_units: string[] = [];

	public form_config: FormGroup = new FormGroup({
		minting: new FormGroup({
			enabled: new FormControl(),
			mint_ttl: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(3600), OrchardValidators.micros]),
		}),
		melting: new FormGroup({
			enabled: new FormControl(),
			melt_ttl: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(3600), OrchardValidators.micros]),
		}),
	});

	public get form_minting(): FormGroup {
		return this.form_config.get('minting') as FormGroup;
	}

	public get form_melting(): FormGroup {
		return this.form_config.get('melting') as FormGroup;
	}

	private subscriptions: Subscription = new Subscription();
	private active_event: EventData | null = null;
	private dirty_count: WritableSignal<number> = signal(0);
	private dirty_count$ = toObservable(this.dirty_count);

	constructor(
		public mintService: MintService,
		public route: ActivatedRoute,
		public eventService: EventService,
		public aiService: AiService,
	) {}

	ngOnInit(): void {	
		this.mint_info = this.route.snapshot.data['mint_info'];
		this.quote_ttls = this.route.snapshot.data['mint_quote_ttl'];
		this.patchStaticFormElements();
		this.minting_units = this.getUniqueUnits('nut4');
		this.melting_units = this.getUniqueUnits('nut5');
		this.buildDynamicFormElements();
		Object.keys(this.form_config.controls).forEach(form_group_key => {
			const form_group = this.form_config.get(form_group_key) as FormGroup;
			if( form_group.get('enabled')?.value === false ) form_group.disable();
		});
		const agent_subscription = this.getAgentSubscription();
		const tool_subscription = this.getToolSubscription();
		const event_subscription = this.getEventSubscription();
		const form_subscription = this.getFormSubscription();
		const dirty_count_subscription = this.getDirtyCountSubscription();
		this.subscriptions.add(agent_subscription);
		this.subscriptions.add(tool_subscription);	
		this.subscriptions.add(event_subscription);
		this.subscriptions.add(form_subscription);
		this.subscriptions.add(dirty_count_subscription);
	}

	private getAgentSubscription(): Subscription {
		return this.aiService.agent_requests$
			.subscribe(({ agent, content }) => {
				const form_string = JSON.stringify(this.form_config.value);
				this.aiService.openAiSocket(agent, content, form_string);
			});
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
				if( event_data === null ) this.evaluateDirtyCount();
			});
	}

	private getFormSubscription(): Subscription {
		return this.form_config.valueChanges.subscribe(() => {
			this.evaluateDirtyCount();
		});
	}

	private evaluateDirtyCount(): void {
		// const count = Object.keys(this.form_info.controls).filter(key => this.form_info.get(key)?.dirty).length;
		// this.dirty_count.set(count);
		// this.cdr.detectChanges();
	}

	private getDirtyCountSubscription(): Subscription {
		return this.dirty_count$.subscribe((count) => {
			this.createPendingEvent(count);
		});
	}

	private executeAgentFunction(tool_call: AiChatToolCall): void {
		// todo
	}

	private patchStaticFormElements(): void {
		this.form_config.patchValue({
			minting: {
				enabled: this.translateDisabled(this.mint_info?.nuts.nut4.disabled),
				mint_ttl: this.translateQuoteTtl(this.quote_ttls.mint_ttl),
			},
			melting: {
				enabled: this.translateDisabled(this.mint_info?.nuts.nut5.disabled),
				melt_ttl: this.translateQuoteTtl(this.quote_ttls.melt_ttl),
			},
		});
	}

	private translateDisabled(status: boolean | undefined): boolean {
		if(status === undefined) return false;
		return !status;
	}

	private translateQuoteTtl(quote_ttl: number | null, to_seconds: boolean = true): number | null {
		const factor = to_seconds ? (1/1000) : 1000;
		return (quote_ttl !== null) ? (quote_ttl * factor) : null;
	}

	private getUniqueUnits(nut: 'nut4' | 'nut5'): string[] {
		const unit_set = new Set<string>();
		this.mint_info?.nuts[nut].methods.forEach( method => unit_set.add(method.unit));
		return Array.from(unit_set);
	}

	private createPendingEvent(count: number): void {
		if( count === 0 && this.active_event?.type !== 'PENDING' ) return;
		if( count === 0 ) return this.eventService.registerEvent(null);
		this.eventService.registerEvent(new EventData({
			type: 'PENDING',
			message: count.toString(),
		}));
	}

	private buildDynamicFormElements(): void {
		this.minting_units.forEach(unit => {
			this.form_minting.addControl(unit, new FormGroup({}));
			this.mint_info?.nuts.nut4.methods
				.filter( method => method.unit === unit)
				.forEach( method => {
					const min_validators = [Validators.required, Validators.min(0)];
					(method.unit === 'sat') ? min_validators.push(OrchardValidators.integer) : min_validators.push(OrchardValidators.cents);
					const max_validators = [Validators.required, OrchardValidators.minGreaterThan('min_amount')];
					(method.unit === 'sat') ? max_validators.push(OrchardValidators.integer) : max_validators.push(OrchardValidators.cents);
					(this.form_minting.get(unit) as FormGroup).addControl(method.method, new FormGroup({
						min_amount: new FormControl(method.min_amount, min_validators),
						max_amount: new FormControl(method.max_amount, max_validators),
						description: new FormControl(method.description),
					}));
				});
		});
		this.melting_units.forEach(unit => {
			this.form_melting.addControl(unit, new FormGroup({}));
			this.mint_info?.nuts.nut5.methods
				.filter( method => method.unit === unit)
				.forEach( method => {
					const min_validators = [Validators.required, Validators.min(0)];
					(method.unit === 'sat') ? min_validators.push(OrchardValidators.integer) : min_validators.push(OrchardValidators.cents);
					const max_validators = [Validators.required, OrchardValidators.minGreaterThan('min_amount')];
					(method.unit === 'sat') ? max_validators.push(OrchardValidators.integer) : max_validators.push(OrchardValidators.cents);
					(this.form_melting.get(unit) as FormGroup).addControl(method.method, new FormGroup({
						min_amount: new FormControl(method.min_amount, min_validators),
						max_amount: new FormControl(method.max_amount, max_validators),
						amountless: new FormControl({ value: method.amountless, disabled: true }),
					}));
				});
		});
	}

	public onEnabledUpdate({
		form_group,
		nut
	}: {
		form_group: FormGroup,
		nut: 'nut4' | 'nut5'
	}): void {
		if(form_group.get('enabled')?.invalid) return;
		form_group.get('enabled')?.markAsPristine();
		const control_value = this.translateDisabled(form_group.get('enabled')?.value);
		(control_value) ? form_group.disable() : form_group.enable();
		this.eventService.registerEvent(new EventData({type: 'SAVING'}));
		const unit = this.mint_info?.nuts[nut].methods[0].unit;
		const method = this.mint_info?.nuts[nut].methods[0].method;
		if( !unit || !method ) return this.eventService.registerEvent(new EventData({type: 'ERROR', message: 'No unit or method found'}));
		if(nut === 'nut4') this.updateMintNut04(unit, method, 'disabled', control_value);
		if(nut === 'nut5') this.updateMintNut05(unit, method, 'disabled', control_value);
	}

	public onTtlCancel(
		{
			form_group,
			control_name
		}: {
			form_group: FormGroup,
			control_name: keyof MintQuoteTtls
		}): void {
		if(!control_name) return;
		form_group.get(control_name)?.markAsPristine();
		form_group.get(control_name)?.setValue(this.translateQuoteTtl(this.quote_ttls[control_name]));
	}

	public onTtlUpdate(
		{
			form_group,
			control_name
		}: {
			form_group: FormGroup,
			control_name: keyof MintQuoteTtls
		}): void {
		if(!control_name) return;
		if(form_group.get(control_name)?.invalid) return;
		form_group.get(control_name)?.markAsPristine();
		const control_value = this.translateQuoteTtl(form_group.get(control_name)?.value, false);
		this.eventService.registerEvent(new EventData({type: 'SAVING'}));
		this.updateMintTtl(control_name, control_value);
	}

	public onMethodUpdate(
		{
			nut,
			unit,
			method,
			form_group,
			control_name
		}: {
			nut: 'nut4' | 'nut5',
			unit: string,
			method: string,
			form_group: FormGroup,
			control_name: keyof OrchardNut4Method | keyof OrchardNut5Method
		}
	): void {
		if(!control_name) return;
		if(form_group.get(unit)?.get(method)?.get(control_name)?.invalid) return;
		form_group.get(unit)?.get(method)?.get(control_name)?.markAsPristine();
		const control_value = form_group.get(unit)?.get(method)?.get(control_name)?.value;
		this.eventService.registerEvent(new EventData({type: 'SAVING'}));
		if(nut === 'nut4') this.updateMintNut04(unit, method, control_name as keyof OrchardNut4Method, control_value);
		if(nut === 'nut5') this.updateMintNut05(unit, method, control_name as keyof OrchardNut5Method, control_value);
	}

	public onMethodCancel(
		{
			nut,
			unit,
			method,
			form_group,
			control_name
		}: {
			nut: 'nut4' | 'nut5',
			unit: string,
			method: string,
			form_group: FormGroup,
			control_name: keyof OrchardNut4Method | keyof OrchardNut5Method
		}
	): void {
		form_group.get(unit)?.get(method)?.get(control_name)?.markAsPristine();
		const nut_method = this.mint_info?.nuts[nut].methods.find( nut_method => nut_method.unit === unit && nut_method.method === method );
		let old_val = (nut === 'nut4') ? (nut_method as OrchardNut4Method)?.[control_name as keyof OrchardNut4Method] : (nut_method as OrchardNut5Method)?.[control_name as keyof OrchardNut5Method];
		form_group.get(unit)?.get(method)?.get(control_name)?.setValue(old_val);
	}

	private onConfirmedEvent(): void {
		// @todo batch updates
	}

	private updateMintTtl(control_name: keyof MintQuoteTtls, control_value: any): void {
		this.mintService.updateMintQuoteTtl(control_name, control_value).subscribe({
			next: (response) => {
				this.quote_ttls[control_name] = this.translateQuoteTtl(response.mint_quote_ttl_update[control_name] ?? null, false);
				this.onSuccess();
				this.form_config.get(control_name)?.markAsPristine();
			},
			error: (error) => {
				this.onError(error.message);
			}
		});
	}

	private updateMintNut04(unit:string, method:string, control_name:keyof OrchardNut4Method | 'disabled', control_value: any): void {
		this.mintService.updateMintNut04(unit, method, control_name, control_value).subscribe({
			next: (response) => {
				const nut_method = this.mint_info?.nuts.nut4.methods.find( nut_method => nut_method.unit === unit && nut_method.method === method );
				if( nut_method ) (nut_method as any)[control_name] = control_value;
				this.onSuccess();
				this.form_config.get(control_name)?.markAsPristine();
			},
			error: (error) => {
				this.onError(error.message);
			}
		});
	}

	private updateMintNut05(unit:string, method:string, control_name:keyof OrchardNut5Method | 'disabled', control_value: any): void {
		this.mintService.updateMintNut05(unit, method, control_name, control_value).subscribe({
			next: (response) => {
				const nut_method = this.mint_info?.nuts.nut5.methods.find( nut_method => nut_method.unit === unit && nut_method.method === method );
				if( nut_method ) (nut_method as any)[control_name] = control_value;
				this.onSuccess();
				this.form_config.get(control_name)?.markAsPristine();
			},
			error: (error) => {
				this.onError(error.message);
			}
		});
	}


	private onSuccess(reset: boolean = false): void {
		this.mintService.clearInfoCache();
		this.mintService.loadMintInfo().subscribe();
		this.eventService.registerEvent(new EventData({type: 'SUCCESS'}));
		if( !reset ) return;
		this.form_config.markAsPristine();
		this.dirty_count.set(0);
	}

	private onError(error: string): void {
		this.eventService.registerEvent(new EventData({
			type: 'ERROR',
			message: error
		}));
	}

	ngOnDestroy(): void {}
}