/* Core Dependencies */
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, HostListener, OnDestroy } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
/* Vendor Dependencies */
import { DateTime } from 'luxon';
import { lastValueFrom, map, Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
/* Application Configuration */
import { environment } from '@client/configs/configuration';
import { OrchardErrors } from '@client/modules/error/classes/error.class';
/* Application Dependencies */
import { NonNullableMintDatabaseSettings } from '@client/modules/settings/types/setting.types';
import { SettingService } from '@client/modules/settings/services/setting/setting.service';
import { EventService } from '@client/modules/event/services/event/event.service';
import { AiService } from '@client/modules/ai/services/ai/ai.service';
import { EventData } from '@client/modules/event/classes/event-data.class';
import { DataType } from '@client/modules/orchard/enums/data.enum';
import { ComponentCanDeactivate } from '@client/modules/routing/interfaces/routing.interfaces';
import { AiChatToolCall } from '@client/modules/ai/classes/ai-chat-chunk.class';
/* Native Dependencies */
import { MintService } from '@client/modules/mint/services/mint/mint.service';
import { MintKeyset } from '@client/modules/mint/classes/mint-keyset.class';
import { MintMintQuote } from '@client/modules/mint/classes/mint-mint-quote.class';
import { MintMeltQuote } from '@client/modules/mint/classes/mint-melt-quote.class';
import { MintProofGroup } from '@client/modules/mint/classes/mint-proof-group.class';
/* Shared Dependencies */
import { MintUnit, MintQuoteState, MeltQuoteState, MintProofState, AiAgent, AiFunctionName } from '@shared/generated.types';

export type MintData = MintMintData | MintMeltData | MintProofData;
type MintMintData = {
	type : DataType.MintMints;
	source : MatTableDataSource<MintMintQuote>;
}
type MintMeltData = {
	type : DataType.MintMelts;
	source : MatTableDataSource<MintMeltQuote>;
}
type MintProofData = {
	type : DataType.MintProofGroups;
	source : MatTableDataSource<MintProofGroup>;
}

enum FormMode {
	CREATE = 'CREATE',
	RESTORE = 'RESTORE',
}

const PAGE_SIZE = 100;

@Component({
	selector: 'orc-mint-subsection-database',
	standalone: false,
	templateUrl: './mint-subsection-database.component.html',
	styleUrl: './mint-subsection-database.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('slideInOut', [
			state('closed', style({
				height: '0',
				opacity: '0',
				overflow: 'hidden'
			})),
			state('open', style({
				height: '*',
				opacity: '1',
				overflow: 'hidden'
			})),
			transition('closed => open', [
				animate('200ms ease-out')
			]),
			transition('open => closed', [
				animate('200ms ease-out')
			])
		]),
		trigger('fadeIn', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('300ms ease-in', style({ opacity: 1 }))
            ])
        ])
	]
})
export class MintSubsectionDatabaseComponent implements ComponentCanDeactivate, OnInit, OnDestroy {

	@HostListener('window:beforeunload')
	canDeactivate(): boolean {
		return this.active_event?.type !== 'PENDING';
	}

	public page_settings!: NonNullableMintDatabaseSettings;
	public filter: string = '';
	public locale!: string;
	public mint_genesis_time: number = 0;
	public loading_static_data: boolean = true;
	public loading_dynamic_data: boolean = true;
	public data!: MintData;
	public count: number = 0;
	public mint_keysets: MintKeyset[] = [];
	public form_mode!: FormMode | null;
	public form_backup: FormGroup = new FormGroup({
		filename: new FormControl(null, [Validators.required, Validators.maxLength(1000)]),
	});
	public form_restore: FormGroup = new FormGroup({
		file: new FormControl(null, [Validators.required]),
		filebase64: new FormControl(null, [Validators.required]),
	});
	public unit_options!: { value: string, label: string }[];
	public state_options!: string[];
	public database_version!: string;
	public database_timestamp!: number;
	public database_implementation!: string;

	private active_event: EventData | null = null;
	private subscriptions: Subscription = new Subscription();
	private backup_encoded: string = '';

	public get page_size(): number {
		return this.data?.source?.data?.length ?? 0;
	}

	constructor(
		private route: ActivatedRoute,
		private settingService: SettingService,
		private eventService: EventService,
		private mintService: MintService,
		private aiService: AiService,
		private cdr: ChangeDetectorRef,
	) {}

	ngOnInit(): void {
		this.mint_keysets = this.route.snapshot.data['mint_keysets'];
		this.unit_options = this.getUnitOptions();
		this.form_backup.reset();
		this.initData();
		this.subscriptions.add(this.getEventSubscription());
		this.subscriptions.add(this.getFormSubscription());
		this.orchardOptionalInit();
	}


	orchardOptionalInit(): void {
		if( environment.ai.enabled ) {
			this.subscriptions.add(this.getAgentSubscription());
			this.subscriptions.add(this.getToolSubscription());
		}
	}

	private getEventSubscription(): Subscription {
		return this.eventService.getActiveEvent().subscribe((event_data: EventData | null) => {
			this.active_event = event_data;
			if( event_data === null ){
				setTimeout(() => {
					if( this.form_mode !== FormMode.CREATE && this.form_mode !== FormMode.RESTORE ) return;
					this.eventService.registerEvent(new EventData({
						type: 'PENDING',
						message: 'Save',
					}));
				},1000);
			}
			if( event_data ){
				if( this.form_mode === FormMode.CREATE ){
					if( event_data.type === 'SUCCESS' ) this.onCreateSuccess();
					if( event_data.type === 'ERROR' ) this.onError();
					if( event_data.confirmed !== null )( event_data.confirmed ) ? this.onCreateConfirmed() : this.onClose();
				}
				if( this.form_mode === FormMode.RESTORE ){
					if( event_data.type === 'SUCCESS' ) this.onRestoreSuccess();
					if( event_data.type === 'ERROR' ) this.onError();
					if( event_data.confirmed !== null )( event_data.confirmed ) ? this.onRestoreConfirmed() : this.onClose();
				}
			}
		});
	}

	private getFormSubscription(): Subscription {
		return this.form_restore.valueChanges.subscribe(() => {
			if( this.form_restore.dirty ) this.eventService.registerEvent(new EventData({
				type: 'PENDING',
				message: 'Restore',
			}));
		});
	}

	private getAgentSubscription(): Subscription {
		return this.aiService.agent_requests$.subscribe(({ agent, content }) => {
			// (this.keysets_rotation) ? this.hireRotationAgent(AiAgent.MintKeysetRotation, content) : this.hireAnalyticsAgent(agent, content);
			this.hireAnalyticsAgent(AiAgent.MintDatabase, content);
		});
	}
	private hireAnalyticsAgent(agent: AiAgent, content: string|null): void {
		let context = `Current Date: ${DateTime.now().toFormat('yyyy-MM-dd')}\n`;
		context += `Current Date Start: ${DateTime.fromSeconds(this.page_settings.date_start).toFormat('yyyy-MM-dd')}\n`;
		context += `Current Date End: ${DateTime.fromSeconds(this.page_settings.date_end).toFormat('yyyy-MM-dd')}\n`;
		context += `Current Data Type: ${this.page_settings.type}\n`;
		context += `Current Units: ${this.page_settings.units}\n`;
		context += `Current States: ${this.page_settings.states}\n`;
		context += `Available Units: ${this.unit_options.map(unit => unit.value).join(', ')}\n`;
		this.aiService.openAiSocket(agent, content, context);
	}
	// private hireRotationAgent(agent: AiAgent, content: string|null): void {
	// 	let context = `Current Unit: ${this.form_keyset.value.unit}\n`;
	// 	context += `Current Input Fee PPK: ${this.form_keyset.value.input_fee_ppk}\n`;
	// 	context += `Current Max Order: ${this.form_keyset.value.max_order}\n`;
	// 	context += `Available Units: ${this.unit_options.map(unit => unit.label).join(', ')}\n`;
	// 	this.aiService.openAiSocket(agent, content, context);
	// }

	private getToolSubscription(): Subscription {
		return this.aiService.tool_calls$.subscribe((tool_call: AiChatToolCall) => {
			this.executeAgentFunction(tool_call);
		});
	}

	private getUnitOptions(): { value: string, label: string }[] {
		const possible_units = Array.from(new Set(this.mint_keysets.map(keyset => keyset.unit)));
		return possible_units.map(unit => ({ value: unit, label: unit.toUpperCase() }));
	}

	private async initData(): Promise<void> {
		this.locale = this.settingService.getLocale();
		this.mint_genesis_time = this.getMintGenesisTime();
		this.page_settings = this.getPageSettings();
		this.state_options = this.getDefaultStates(this.page_settings.type);
		this.loading_static_data = false;
		this.cdr.detectChanges();
		await this.getDynamicData();
		this.loading_dynamic_data = false;
		this.cdr.detectChanges();
	}

	private getMintGenesisTime(): number {
		if (!this.mint_keysets || this.mint_keysets.length === 0) return 0;
		return this.mint_keysets.reduce((oldest_time, keyset) => {
			return keyset.valid_from < oldest_time || oldest_time === 0 
				? keyset.valid_from 
				: oldest_time;
		}, 0);
	}

	private getPageSettings(): NonNullableMintDatabaseSettings {
		const settings = this.settingService.getMintDatabaseSettings();
		const type = settings.type ?? DataType.MintMints;
		return {
			type: type,
			date_start: settings.date_start ?? this.mint_genesis_time,
			date_end: settings.date_end ?? this.getDefaultDateEnd(),
			page: settings.page ?? 1,
			units: settings.units ?? this.getDefaultUnits(),
			states: settings.states ?? this.getDefaultStates(type)
		};
	}

	private getDefaultDateEnd(): number {
		const today = DateTime.now().endOf('day');
		return Math.floor(today.toSeconds());
	}

	private getDefaultUnits(): MintUnit[] {
		return Array.from(new Set(this.mint_keysets.map(keyset => keyset.unit)));
	}

	private getDefaultStates(type: DataType): string[] {
		if( type === DataType.MintMints ) return Object.values(MintQuoteState);
		if( type === DataType.MintMelts ) return Object.values(MeltQuoteState);
		if( type === DataType.MintProofGroups ) return Object.values(MintProofState);
		return [];
	}

	private async getDynamicData(): Promise<void> {
		if( this.page_settings.type === DataType.MintMints ) return this.getMintsData();
		if( this.page_settings.type === DataType.MintMelts ) return this.getMeltsData();
		if( this.page_settings.type === DataType.MintProofGroups ) return this.getProofsData();
	}

	private async getMintsData(): Promise<void> {
		const mint_mint_quotes_data = await lastValueFrom(
			this.mintService.getMintMintQuotesData({
				date_start: this.page_settings.date_start,
				date_end: this.page_settings.date_end,
				units: this.page_settings.units,
				states: (this.page_settings.states as MintQuoteState[]),
				page: this.page_settings.page,
				page_size: PAGE_SIZE,
			})
		);
		this.data = {
			type: DataType.MintMints,
			source: new MatTableDataSource(mint_mint_quotes_data.mint_mint_quotes)
		};
		this.count = mint_mint_quotes_data.count;
	}

	private async getMeltsData(): Promise<void> {
		const mint_melt_quotes_data = await lastValueFrom(
			this.mintService.getMintMeltQuotesData({
				date_start: this.page_settings.date_start,
				date_end: this.page_settings.date_end,
				units: this.page_settings.units,
				states: (this.page_settings.states as MeltQuoteState[]),
				page: this.page_settings.page,
				page_size: PAGE_SIZE,
			})
		);
		this.data = {
			type: DataType.MintMelts,
			source: new MatTableDataSource(mint_melt_quotes_data.mint_melt_quotes)
		};
		this.count = mint_melt_quotes_data.count;
	}

	private async getProofsData(): Promise<void> {
		const mint_proof_groups_data = await lastValueFrom(
			this.mintService.getMintProofGroupsData({
				date_start: this.page_settings.date_start,
				date_end: this.page_settings.date_end,
				states: (this.page_settings.states as MintProofState[]),
				page: this.page_settings.page,
				page_size: PAGE_SIZE,
			})
		);
		this.data = {
			type: DataType.MintProofGroups,
			source: new MatTableDataSource(mint_proof_groups_data.mint_proof_groups)
		};
		console.log(this.data);
		this.count = mint_proof_groups_data.count;
	}

	private async reloadDynamicData(): Promise<void> {
		try {
			this.loading_dynamic_data = true;
			this.cdr.detectChanges();
			await this.getDynamicData();
			this.loading_dynamic_data = false;
			this.cdr.detectChanges();
		} catch (error) {
			console.error('Error updating dynamic data:', error);
		}
	}

	public onDateChange(event: number[]): void {
		this.page_settings.date_start = event[0];
		this.page_settings.date_end = event[1];
		this.settingService.setMintDatabaseShortSettings(this.page_settings);
		this.reloadDynamicData();
	}

	public onTypeChange(event: DataType): void {
		const default_states = this.getDefaultStates(event);
		this.page_settings.type = event;
		this.page_settings.states = default_states;
		this.settingService.setMintDatabaseSettings(this.page_settings);
		this.state_options = default_states;
		this.reloadDynamicData();
	}

	public onUnitsChange(event: MintUnit[]): void {
		this.page_settings.units = event;
		this.settingService.setMintDatabaseSettings(this.page_settings);
		this.reloadDynamicData();
	}

	public onStatesChange(event: string[]): void {
		this.page_settings.states = event;
		this.settingService.setMintDatabaseSettings(this.page_settings);
		this.reloadDynamicData();
	}

	public onPage(event: PageEvent): void {
		this.page_settings.page = event.pageIndex + 1;	
		this.settingService.setMintDatabaseShortSettings(this.page_settings);
		this.reloadDynamicData();
	}

	public onFilterChange(event: Event): void {
		this.filter = (event.target as HTMLInputElement).value;
		this.data.source.filter = this.filter.trim().toLowerCase();
		this.cdr.detectChanges();
	}

	public onCreate(): void {
		( this.form_mode !== FormMode.CREATE ) ? this.initCreateBackup() : this.onClose();
	}
	public onRestore(): void {
		( this.form_mode !== FormMode.RESTORE ) ? this.initRestoreBackup() : this.onClose();
	}

	private initCreateBackup(): void {
		this.form_mode = FormMode.CREATE;
		this.eventService.registerEvent(new EventData({
			type: 'PENDING',
			message: 'Save',
		}));
		this.getDefaultFilename();
	}

	private async getDefaultFilename(): Promise<void> {
		this.mintService.loadMintInfo().subscribe((mint_info) => {
			this.database_version = mint_info.version.replace(/\//g, '-');
			this.database_timestamp = DateTime.now().toSeconds();
			this.database_implementation = 'sqlite';
			const filename = `MintDatabaseBackup-${this.database_version}-${DateTime.fromSeconds(this.database_timestamp).toFormat('yyyyMMdd-HHmmss')}.db`;
			this.form_backup.patchValue({
				filename: filename
			});
		});
	}

	private initRestoreBackup(): void {
		this.form_mode = FormMode.RESTORE;
		// this.eventService.registerEvent(new EventData({
		// 	type: 'PENDING',
		// 	message: 'Restore',
		// }));
	}

	public onClose(): void {
		this.form_backup.reset();
		this.form_restore.reset();
		this.form_mode = null;
		this.eventService.registerEvent(null);
		this.cdr.detectChanges();
	}	

	private onCreateConfirmed(): void {
		if (this.form_backup.invalid) {
			return this.eventService.registerEvent(new EventData({
				type: 'WARNING',
				message: 'Invalid filename',
			}));
		}
		this.eventService.registerEvent(new EventData({type: 'SAVING'}));
		this.mintService.createMintDatabaseBackup().subscribe({
			next: (response) => {
				this.backup_encoded = response.mint_database_backup.filebase64;
				this.eventService.registerEvent(new EventData({
					type: 'SUCCESS',
					message: 'Backup created!',
				}));
			},
			error: (errors: OrchardErrors) => {
				this.eventService.registerEvent(new EventData({
					type: 'ERROR',
					message: errors.errors[0].message
				}));
			}
		});
	}
	private onRestoreConfirmed(): void {
		if (this.form_restore.invalid) {
			return this.eventService.registerEvent(new EventData({
				type: 'WARNING',
				message: 'Invalid backup file',
			}));
		}
		this.eventService.registerEvent(new EventData({type: 'SAVING'}));
		this.mintService.restoreMintDatabaseBackup(this.form_restore.get('filebase64')?.value).subscribe({
			next: (response) => {
				this.eventService.registerEvent(new EventData({
					type: 'SUCCESS',
					message: 'Backup restored!',
				}));
			},
			error: (errors: OrchardErrors) => {
				this.eventService.registerEvent(new EventData({
					type: 'ERROR',
					message: errors.errors[0].message
				}));
			}
		});
	}


	private onCreateSuccess(): void {
		const decoded_data = atob(this.backup_encoded);
		const uint8_array = Uint8Array.from(decoded_data, c => c.charCodeAt(0));
		const file = new File([uint8_array], this.form_backup.get('filename')?.value, { type: 'application/octet-stream' });
		const url = URL.createObjectURL(file);
		const a = document.createElement('a');
		a.href = url;
		a.download = this.form_backup.get('filename')?.value;
		a.click();
		this.form_mode = null;
		this.backup_encoded = '';
		this.cdr.detectChanges();
	}

	private onRestoreSuccess(): void {
		this.form_mode = null;
		this.form_restore.reset();
		this.cdr.detectChanges();
	}

	private onError(): void {
		this.form_mode = null;
		this.form_backup.reset();
		this.form_restore.reset();
		this.cdr.detectChanges();
	}

	private executeAgentFunction(tool_call: AiChatToolCall): void {
		if( tool_call.function.name === AiFunctionName.MintAnalyticsDateRangeUpdate ) {
			const range = [
				DateTime.fromFormat(tool_call.function.arguments.date_start, 'yyyy-MM-dd').toSeconds(),
				DateTime.fromFormat(tool_call.function.arguments.date_end, 'yyyy-MM-dd').toSeconds()
			];
			this.onDateChange(range);
		}
		if( tool_call.function.name === AiFunctionName.MintAnalyticsUnitsUpdate ) {
			// @todo parse this too....
			this.onUnitsChange(tool_call.function.arguments.units);
		}
		// if( tool_call.function.name === AiFunctionName.MintKeysetStatusUpdate ) {
		// 	// @todo try catch this parse
		// 	const parsed_statuses = JSON.parse(tool_call.function.arguments.statuses as any);
		// 	const statuses = parsed_statuses.map((status: boolean) => status);
		// 	this.onStatusChange(statuses);
		// }
	}

	ngOnDestroy(): void {
		this.form_mode = null;
		this.subscriptions.unsubscribe();
	}
}