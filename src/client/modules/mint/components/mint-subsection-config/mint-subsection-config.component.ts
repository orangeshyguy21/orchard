/* Core Dependencies */
import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, WritableSignal, signal, ChangeDetectorRef, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { toObservable } from '@angular/core/rxjs-interop';
import { trigger, transition, style, animate } from '@angular/animations';
/* Vendor Dependencies */
import { Subscription, lastValueFrom, forkJoin } from 'rxjs';
/* Application Configuration */
import { environment } from '@client/configs/configuration';
/* Application Dependencies */
import { EventService } from '@client/modules/event/services/event/event.service';
import { OrchardValidators } from '@client/modules/form/validators';
import { EventData } from '@client/modules/event/classes/event-data.class';
import { AiService } from '@client/modules/ai/services/ai/ai.service';
import { SettingService } from '@client/modules/settings/services/setting/setting.service';
import { AiChatToolCall } from '@client/modules/ai/classes/ai-chat-chunk.class';
import { ComponentCanDeactivate } from '@client/modules/routing/interfaces/routing.interfaces';
/* Native Dependencies */
import { MintService } from '@client/modules/mint/services/mint/mint.service';
import { MintInfo } from '@client/modules/mint/classes/mint-info.class';
import { MintQuoteTtls } from '@client/modules/mint/classes/mint-quote-ttls.class';
import { MintMintQuote } from '@client/modules/mint/classes/mint-mint-quote.class';
import { MintMeltQuote } from '@client/modules/mint/classes/mint-melt-quote.class';
import { Nut15Method, Nut17Commands } from '@client/modules/mint/types/nut.types';
/* Shared Dependencies */
import { OrchardNut4Method, OrchardNut5Method, AiFunctionName } from '@shared/generated.types';

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
export class MintSubsectionConfigComponent implements ComponentCanDeactivate, OnInit, OnDestroy {

	@HostListener('window:beforeunload')
	canDeactivate(): boolean {
		return this.active_event?.type !== 'PENDING';
	}

	public mint_info: MintInfo | null = null;
	public quote_ttls!: MintQuoteTtls;
	public minting_units: string[] = [];
	public melting_units: string[] = [];
	public locale!: string;
	public data_loading: boolean = true;
	public mint_quotes: MintMintQuote[] = [];
	public melt_quotes: MintMeltQuote[] = [];
	public nut15_methods: Nut15Method[] = [];
	public nut17_commands: Nut17Commands[] = [];
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
		public settingService: SettingService,
		public cdr: ChangeDetectorRef
	) {}

	ngOnInit(): void {	
		this.mint_info = this.route.snapshot.data['mint_info'];
		this.quote_ttls = this.route.snapshot.data['mint_quote_ttl'];
		this.patchStaticFormElements();
		this.minting_units = this.getUniqueUnits('nut4');
		this.melting_units = this.getUniqueUnits('nut5');
		this.nut15_methods = this.getNut15Methods();
		this.nut17_commands = this.getNut17Commands();
		this.buildDynamicFormElements();
		this.initChartData();
		Object.keys(this.form_config.controls).forEach(form_group_key => {
			const form_group = this.form_config.get(form_group_key) as FormGroup;
			if( form_group.get('enabled')?.value === false ) form_group.disable();
		});
		this.subscriptions.add(this.getMintInfoSubscription());
		this.subscriptions.add(this.getEventSubscription());
		this.subscriptions.add(this.getFormSubscription());
		this.subscriptions.add(this.getDirtyCountSubscription());
		this.orchardOptionalInit();
	}

	orchardOptionalInit(): void {
		if( environment.ai.enabled ) {
			this.subscriptions.add(this.getAgentSubscription());
			this.subscriptions.add(this.getToolSubscription());
		}
	}

	private getMintInfoSubscription(): Subscription {
		return this.mintService.mint_info$.subscribe(
            (info:MintInfo | null) => {
				if( info ) this.mint_info = info;
				( this.mint_info?.nuts.nut4.disabled ) ? this.form_minting.disable() : this.form_minting.enable();
				( this.mint_info?.nuts.nut5.disabled ) ? this.form_melting.disable() : this.form_melting.enable();
				this.cdr.detectChanges();
            }
        );
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
				if( event_data === null ) this.evaluateDirtyCount();
				if( event_data && event_data.confirmed !== null ){
					( event_data.confirmed ) ? this.onConfirmedEvent() : this.onUnconfirmedEvent();
				}
			});
	}

	private getFormSubscription(): Subscription {
		return this.form_config.valueChanges.subscribe(() => {
			this.evaluateDirtyCount();
		});
	}

	private evaluateDirtyCount(): void {
		let count = 0;
		
		const countDirtyControls = (group: FormGroup): number => {
			return Object.keys(group.controls).reduce((acc, key) => {
				const control = group.get(key);
				if (control instanceof FormGroup) return acc + countDirtyControls(control);
				return acc + (control?.dirty ? 1 : 0);
			}, 0);
		};
		
		count = countDirtyControls(this.form_config);
		this.dirty_count.set(count);
		this.cdr.detectChanges();
	}

	private getDirtyCountSubscription(): Subscription {
		return this.dirty_count$.subscribe((count) => {
			this.createPendingEvent(count);
		});
	}

	private executeAgentFunction(tool_call: AiChatToolCall): void {
		if( tool_call.function.name === AiFunctionName.MintEnabledUpdate ) {
			const operation = tool_call.function.arguments.operation;
			const enabled = tool_call.function.arguments.enabled;
			const form_group = (operation === 'minting') ? this.form_minting : this.form_melting;
			if( !form_group ) return;
			form_group.get('enabled')?.markAsDirty();
			form_group.get('enabled')?.setValue(enabled); 
		}
		if( tool_call.function.name === AiFunctionName.MintQuoteTtlUpdate ) {
			const operation = tool_call.function.arguments.operation;
			const ttl = tool_call.function.arguments.ttl;
			const form_control = (operation === 'minting') ? this.form_minting.get('mint_ttl') : this.form_melting.get('melt_ttl');
			if( !form_control ) return;
			form_control?.markAsDirty();
			form_control?.setValue(ttl);
		}
		if( tool_call.function.name === AiFunctionName.MintMethodMinUpdate ) {
			const operation = tool_call.function.arguments.operation;
			const method = tool_call.function.arguments.method;
			const unit = tool_call.function.arguments.unit;
			const min_amount = tool_call.function.arguments.min_amount;
			const form_group = (operation === 'minting') ? this.form_minting : this.form_melting;
			const form_control = form_group.get(unit)?.get(method)?.get('min_amount');
			if( !form_control ) return;
			form_control?.markAsDirty();
			form_control?.setValue(min_amount);
		}
		if( tool_call.function.name === AiFunctionName.MintMethodMaxUpdate ) {
			const operation = tool_call.function.arguments.operation;
			const method = tool_call.function.arguments.method;
			const unit = tool_call.function.arguments.unit;
			const max_amount = tool_call.function.arguments.max_amount;
			const form_group = (operation === 'minting') ? this.form_minting : this.form_melting;
			const form_control = form_group.get(unit)?.get(method)?.get('max_amount');
			if( !form_control ) return;
			form_control?.markAsDirty();
			form_control?.setValue(max_amount);
		}
		if( tool_call.function.name === AiFunctionName.MintMethodDescriptionUpdate ) {
			const method = tool_call.function.arguments.method;
			const unit = tool_call.function.arguments.unit;
			const description = tool_call.function.arguments.description;
			const form_control = this.form_minting.get(unit)?.get(method)?.get('description');
			if( !form_control ) return;
			form_control.markAsDirty();
			if( typeof description === 'string' ) return form_control.setValue(JSON.parse((description as string).toLowerCase()));
			form_control.setValue(description);
		}
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

	private getNut15Methods(): Nut15Method[] {
		const all_units : string[] = this.mint_info?.nuts.nut15.methods.map(m => m.unit) || [];
		const units = Array.from(new Set(all_units));
		return units.map(unit => ({
			unit,
			methods: this.mint_info?.nuts.nut15.methods.filter(m => m.unit === unit).map(m => m.method) || []
		}));
	}

	private getNut17Commands(): Nut17Commands[] {
		const all_units : string[] = this.mint_info?.nuts.nut17.supported.map(m => m.unit) || [];
		const units = Array.from(new Set(all_units));
		const nut17_commands: Nut17Commands[] = [];
		units.forEach(unit => {
			const methods = this.mint_info?.nuts.nut17.supported.filter( supp => supp.unit === unit).map( supp => supp.method) || [];
			const mcommands = methods.map(method => {
				return {
					method: method,
					commands: []
				}
			});
			nut17_commands.push({ unit, methods: mcommands })
		});
		nut17_commands.forEach( group => {
			group.methods.forEach( method => {
				this.mint_info?.nuts.nut17.supported.filter( supp => supp.unit === group.unit && supp.method === method.method).forEach( supp => {
					supp.commands.forEach( command => {
						method.commands.push(command);
					});
				});
			});
		});
		return nut17_commands;
	}

	private createPendingEvent(count: number): void {
		if( this.active_event?.type === 'SAVING' ) return;
		if( count === 0 && this.active_event?.type !== 'PENDING' ) return;
		if( count === 0 ) return this.eventService.registerEvent(null);
		const message = (count === 1) ? '1 update' : `${count} updates`;
		this.eventService.registerEvent(new EventData({
			type: 'PENDING',
			message: message,
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

	private async initChartData(): Promise<void> {
		this.locale = this.settingService.getLocale();
		await this.loadChartData();
		this.data_loading = false;
		this.cdr.detectChanges();
	}

	private async loadChartData(): Promise<void> {
		const mint_quotes_obs = this.mintService.loadMintMintQuotes();
		const melt_quotes_obs = this.mintService.loadMintMeltQuotes();

		const [
			mint_quotes,
			melt_quotes,
		] = await lastValueFrom(
			forkJoin([
				mint_quotes_obs,
				melt_quotes_obs,
			])
		);
		
		this.mint_quotes = mint_quotes;
		this.melt_quotes = melt_quotes;
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
		if( !unit || !method ) return this.eventService.registerEvent(new EventData({
			type: 'ERROR',
			message: 'No unit or method found',
		}));
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

	private onUnconfirmedEvent(): void {
		this.onTtlCancel({
			form_group: this.form_minting,
			control_name: 'mint_ttl',
		});
		this.onTtlCancel({
			form_group: this.form_melting,
			control_name: 'melt_ttl',
		});
		this.minting_units.forEach(unit => {
			this.mint_info?.nuts.nut4.methods.forEach(method => {
				this.onMethodCancel({
					nut: 'nut4',
					unit: unit,
					method: method.method,
					form_group: this.form_minting,
					control_name: 'min_amount',
				});
				this.onMethodCancel({
					nut: 'nut4',
					unit: unit,
					method: method.method,
					form_group: this.form_minting,
					control_name: 'max_amount',
				});
			});
		});
		this.melting_units.forEach(unit => {
			this.mint_info?.nuts.nut5.methods.forEach(method => {
				this.onMethodCancel({
					nut: 'nut5',
					unit: unit,
					method: method.method,
					form_group: this.form_melting,
					control_name: 'min_amount',
				});
				this.onMethodCancel({
					nut: 'nut5',
					unit: unit,
					method: method.method,
					form_group: this.form_melting,
					control_name: 'max_amount',
				});
			});
		});
	}

	private onConfirmedEvent(): void {
		if (this.form_config.invalid) {
			return this.eventService.registerEvent(new EventData({
				type: 'WARNING',
				message: 'Invalid config',
			}));
		}
		this.eventService.registerEvent(new EventData({type: 'SAVING'}));
		const mutation_parts: string[] = [];
		const mutation_types: Record<string, string> = {};
		const mutation_values: Record<string, any> = {};
		const ttl_updates: Record<string, (number|null)> = {};

		if (this.form_minting.get('mint_ttl')?.dirty) ttl_updates['mint_ttl'] = this.translateQuoteTtl(this.form_minting.get('mint_ttl')?.value, false);
		if (this.form_melting.get('melt_ttl')?.dirty) ttl_updates['melt_ttl'] = this.translateQuoteTtl(this.form_melting.get('melt_ttl')?.value, false);
		
		if (Object.keys(ttl_updates).length > 0) {
			mutation_parts.push(`
				mint_quote_ttl_update(mint_quote_ttl_update: $ttl_update) {
					mint_ttl
					melt_ttl
				}
			`);
			mutation_types['ttl_update'] = 'MintQuoteTtlUpdateInput!';
			mutation_values['ttl_update'] = ttl_updates;
		}

		this.minting_units.forEach(unit => {
			const unit_group = this.form_minting.get(unit) as FormGroup;
			if (!unit_group) return;
			Object.keys(unit_group.controls).forEach(method => {
				const method_group = unit_group.get(method) as FormGroup;
				if (!method_group) return;
				const method_update: Record<string, any> = { unit, method };
				if ( this.form_minting.get('enabled')?.dirty ) method_update['disabled'] = this.translateDisabled(this.form_minting.get('enabled')?.value);
				if (method_group.get('min_amount')?.dirty) method_update['min_amount'] = method_group.get('min_amount')?.value;
				if (method_group.get('max_amount')?.dirty) method_update['max_amount'] = method_group.get('max_amount')?.value;
				if (method_group.get('description')?.dirty) method_update['description'] = method_group.get('description')?.value;
				if (Object.keys(method_update).length > 2) {
					const var_name = `nut04_update_${unit}_${method}`;
					mutation_parts.push(`
						mint_nut04_update_${unit}_${method}: mint_nut04_update(mint_nut04_update: $${var_name}) {
							unit
							method
							max_amount
							min_amount
							description
							disabled
						}
					`);
					mutation_types[var_name] = 'MintNut04UpdateInput!';
					mutation_values[var_name] = method_update;
				}
			});
		});

		this.melting_units.forEach(unit => {
			const unit_group = this.form_melting.get(unit) as FormGroup;
			if (!unit_group) return;
			Object.keys(unit_group.controls).forEach(method => {
				const method_group = unit_group.get(method) as FormGroup;
				if (!method_group) return;
				const method_update: Record<string, any> = { unit, method };
				if ( this.form_melting.get('enabled')?.dirty ) method_update['disabled'] = this.translateDisabled(this.form_melting.get('enabled')?.value);
				if (method_group.get('min_amount')?.dirty) method_update['min_amount'] = method_group.get('min_amount')?.value;
				if (method_group.get('max_amount')?.dirty) method_update['max_amount'] = method_group.get('max_amount')?.value;
				if (Object.keys(method_update).length > 2) {
					const var_name = `nut05_update_${unit}_${method}`;
					mutation_parts.push(`
						mint_nut05_update_${unit}_${method}: mint_nut05_update(mint_nut05_update: $${var_name}) {
							unit
							method
							max_amount
							min_amount
							disabled
						}
					`);
					mutation_types[var_name] = 'MintNut05UpdateInput!';
					mutation_values[var_name] = method_update;
				}
			});
		});

		if (mutation_parts.length === 0) return;

		const mutation = `
			mutation BulkMintUpdate(${
				Object.entries(mutation_types)
					.map(([key, type]) => `$${key}: ${type}`)
					.join(',\n            ')
			}) {
				${mutation_parts.join('\n')}
			}
		`;

		this.mintService.updateMint(mutation, mutation_values).subscribe({
			next: (response) => {
				this.mintService.clearInfoCache();
				this.mintService.loadMintInfo().subscribe();
				this.mintService.getMintQuoteTtls().subscribe((quote_ttls: MintQuoteTtls) => {
					this.quote_ttls = quote_ttls;
					this.cdr.detectChanges();
				});
				this.onSuccess(true);
			},
			error: (error) => {
				this.onError(error.message);
			}
		});
	}

	private updateMintTtl(control_name: keyof MintQuoteTtls, control_value: any): void {
		this.mintService.updateMintQuoteTtl(control_name, control_value).subscribe({
			next: (response) => {
				this.quote_ttls[control_name] = response.mint_quote_ttl_update[control_name] ?? null;
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
				if( control_name === 'disabled' &&  this.mint_info ) this.mint_info.nuts.nut4.disabled = control_value;
				this.cdr.detectChanges();
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
				if( control_name === 'disabled' &&  this.mint_info ) this.mint_info.nuts.nut5.disabled = control_value;
				this.cdr.detectChanges();
				this.onSuccess();
				this.form_config.get(control_name)?.markAsPristine();
			},
			error: (error) => {
				this.onError(error.message);
			}
		});
	}


	private onSuccess(reset: boolean = false): void {
		this.eventService.registerEvent(new EventData({
			type: 'SUCCESS',
			message: 'Configuration updated!',
		}));
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