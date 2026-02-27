/* Core Dependencies */
import {ChangeDetectionStrategy, Component, OnInit, OnDestroy, inject, signal, computed} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
/* Vendor Dependencies */
import {DateTime} from 'luxon';
import {Subscription, finalize} from 'rxjs';
import {PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
/* Application Dependencies */
import {SettingDeviceService} from '@client/modules/settings/services/setting-device/setting-device.service';
import {AllEventLogSettings} from '@client/modules/settings/types/setting.types';
import {ConfigService} from '@client/modules/config/services/config.service';
import {DeviceType} from '@client/modules/layout/types/device.types';
import {DateRangePreset} from '@client/modules/form/types/form-daterange.types';
import {resolveDateRangePreset} from '@client/modules/form/helpers/form-daterange.helpers';
import {CrewService} from '@client/modules/crew/services/crew/crew.service';
import {User} from '@client/modules/crew/classes/user.class';
import {AiService} from '@client/modules/ai/services/ai/ai.service';
import {AiChatToolCall} from '@client/modules/ai/classes/ai-chat-chunk.class';
/* Native Dependencies */
import {EventLogService} from '@client/modules/event/services/event-log/event-log.service';
import {EventLog} from '@client/modules/event/classes/event-log.class';
/* Shared Dependencies */
import {EventLogSection, EventLogType, EventLogStatus, AiAgent, AiFunctionName, QueryEvent_LogsArgs} from '@shared/generated.types';

@Component({
	selector: 'orc-event-subsection-log',
	standalone: false,
	templateUrl: './event-subsection-log.component.html',
	styleUrl: './event-subsection-log.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventSubsectionLogComponent implements OnInit, OnDestroy {
	private readonly eventLogService = inject(EventLogService);
	private readonly settingDeviceService = inject(SettingDeviceService);
	private readonly configService = inject(ConfigService);
	private readonly crewService = inject(CrewService);
	private readonly aiService = inject(AiService);
	private readonly breakpointObserver = inject(BreakpointObserver);
	private readonly route = inject(ActivatedRoute);

	public page_settings!: AllEventLogSettings;
	public data_source = new MatTableDataSource<EventLog>([]);

	public readonly device_type = signal<DeviceType>('desktop');
	public readonly users = signal<User[]>([]);
	public readonly error = signal<boolean>(false);
	public readonly count = signal<number>(0);
	public readonly id_user = signal<string | null>(null);
	public readonly locale = signal<string>(this.settingDeviceService.getLocale());

    public readonly loading = computed(() => this.loading_users() || this.loading_events());

	private readonly loading_users = signal<boolean>(true);
	private readonly loading_events = signal<boolean>(true);

    private genesis_timestamp = 0;
	private subscriptions = new Subscription();

    /* *******************************************************
        Initialize
    ******************************************************** */

	ngOnInit(): void {
		this.genesis_timestamp = this.route.snapshot.data['event_log_genesis'] ?? 0;
		this.page_settings = this.getPageSettings();
		this.subscriptions.add(this.getBreakpointSubscription());
		this.subscriptions.add(this.getUserSubscription());
		this.orchardOptionalInit();
		this.loadUsers();
		this.loadData();
	}

	orchardOptionalInit(): void {
		if (this.configService.config.ai.enabled) {
			this.subscriptions.add(this.getAgentSubscription());
			this.subscriptions.add(this.getToolSubscription());
		}
	}

	/* *******************************************************
        Settings
    ******************************************************** */

	/** Merges long-term and short-term settings with defaults */
	private getPageSettings(): AllEventLogSettings {
		const settings = this.settingDeviceService.getEventLogSettings();
		let date_start = settings.date_start ?? this.getDefaultDateStart();
		let date_end = settings.date_end ?? this.getDefaultDateEnd();
		const date_preset = settings.date_preset ?? null;
		if (date_preset) {
			const resolved = resolveDateRangePreset(date_preset, this.genesis_timestamp);
			date_start = resolved.date_start;
			date_end = resolved.date_end;
		}
		return {
			sections: settings.sections ?? [],
			actor_types: settings.actor_types ?? [],
			actor_ids: settings.actor_ids ?? [],
			types: settings.types ?? [],
			statuses: settings.statuses ?? [],
			date_start,
			date_end,
			date_preset,
			page: settings.page ?? 0,
			page_size: settings.page_size ?? 100,
		};
	}

	/** Returns unix timestamp for 30 days ago */
	private getDefaultDateStart(): number {
		return Math.floor(DateTime.now().minus({days: 30}).startOf('day').toSeconds());
	}

	/** Returns unix timestamp for end of today */
	private getDefaultDateEnd(): number {
		return Math.floor(DateTime.now().endOf('day').toSeconds());
	}

	/* *******************************************************
		Subscriptions                      
	******************************************************** */

	private getUserSubscription(): Subscription {
		return this.crewService.user$.subscribe({
			next: (user: User | null) => {
				if (user === undefined || user === null) return;
				this.id_user.set(user.id);
			},
			error: (error) => {
				console.error(error);
				this.id_user.set(null);
			},
		});
	}

	/** Subscribes to viewport breakpoints for responsive layout */
	private getBreakpointSubscription(): Subscription {
		return this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium]).subscribe((result) => {
			if (result.breakpoints[Breakpoints.XSmall]) {
				this.device_type.set('mobile');
			} else if (result.breakpoints[Breakpoints.Small] || result.breakpoints[Breakpoints.Medium]) {
				this.device_type.set('tablet');
			} else {
				this.device_type.set('desktop');
			}
		});
	}

	/** Subscribes to agent requests from the AI input */
	private getAgentSubscription(): Subscription {
		return this.aiService.agent_requests$.subscribe(({agent: _agent, content}) => {
			this.hireEventLogAgent(content);
		});
	}

	/** Subscribes to tool calls from the AI response */
	private getToolSubscription(): Subscription {
		return this.aiService.tool_calls$.subscribe((tool_call: AiChatToolCall) => {
			this.executeAgentFunction(tool_call);
		});
	}

	/* *******************************************************
        Data
    ******************************************************** */

	/** Loads users for actor display */
	private loadUsers(): void {
		this.loading_users.set(true);
		this.crewService
			.loadUsers()
			.pipe(finalize(() => this.loading_users.set(false)))
			.subscribe({
				next: (users) => this.users.set(users),
				error: () => this.error.set(true),
			});
	}

	/** Fetches event logs with current filters */
	private loadData(): void {
		this.loading_events.set(true);
		this.error.set(false);
		const filters: QueryEvent_LogsArgs = {
			sections: this.page_settings.sections.length > 0 ? this.page_settings.sections : undefined,
			actor_ids: this.page_settings.actor_ids.length > 0 ? this.page_settings.actor_ids : undefined,
			types: this.page_settings.types.length > 0 ? this.page_settings.types : undefined,
			statuses: this.page_settings.statuses.length > 0 ? this.page_settings.statuses : undefined,
			date_start: this.page_settings.date_start ?? undefined,
			date_end: this.page_settings.date_end ?? undefined,
			page: this.page_settings.page ?? undefined,
			page_size: this.page_settings.page_size ?? undefined,
		};
		this.eventLogService
			.getEventLogsData(filters)
			.pipe(finalize(() => this.loading_events.set(false)))
			.subscribe({
				next: (result) => {
					this.data_source.data = result.event_logs;
					this.count.set(result.count);
				},
				error: () => this.error.set(true),
			});
	}

	/* *******************************************************
        Actions Up
    ******************************************************** */

	/** Handles sections filter change */
	public onSectionsChange(sections: EventLogSection[]): void {
		this.page_settings.sections = sections;
		this.page_settings.page = 0;
		this.settingDeviceService.setEventLogSettings(this.page_settings);
		this.loadData();
	}

	/** Handles actor ids filter change */
	public onActorIdsChange(actor_ids: string[]): void {
		this.page_settings.actor_ids = actor_ids;
		this.page_settings.page = 0;
		this.settingDeviceService.setEventLogSettings(this.page_settings);
		this.loadData();
	}

	/** Handles types filter change */
	public onTypesChange(types: EventLogType[]): void {
		this.page_settings.types = types;
		this.page_settings.page = 0;
		this.settingDeviceService.setEventLogSettings(this.page_settings);
		this.loadData();
	}

	/** Handles statuses filter change */
	public onStatusesChange(statuses: EventLogStatus[]): void {
		this.page_settings.statuses = statuses;
		this.page_settings.page = 0;
		this.settingDeviceService.setEventLogSettings(this.page_settings);
		this.loadData();
	}

	/** Handles reset filter */
	public onResetFilter(): void {
		this.page_settings.actor_ids = [];
		this.page_settings.sections = [];
		this.page_settings.types = [];
		this.page_settings.statuses = [];
		this.settingDeviceService.setEventLogSettings(this.page_settings);
		this.loadData();
	}

	/** Handles date range filter change */
	public onDateChange(event: number[]): void {
		if (event[0] === this.page_settings.date_start && event[1] === this.page_settings.date_end) return;
		this.page_settings.date_start = event[0];
		this.page_settings.date_end = event[1];
		this.page_settings.date_preset = null;
		this.page_settings.page = 0;
		this.settingDeviceService.setEventLogSettings(this.page_settings);
		this.loadData();
	}

	/** Handles preset selection — resolves the preset and reloads */
	public onPresetChange(preset: DateRangePreset): void {
		const {date_start, date_end} = resolveDateRangePreset(preset, this.genesis_timestamp);
		this.page_settings.date_start = date_start;
		this.page_settings.date_end = date_end;
		this.page_settings.date_preset = preset;
		this.page_settings.page = 0;
		this.settingDeviceService.setEventLogSettings(this.page_settings);
		this.loadData();
	}

	/** Handles paginator page change */
	public onPage(event: PageEvent): void {
		this.page_settings.page = event.pageIndex;
		this.page_settings.page_size = event.pageSize;
		this.settingDeviceService.setEventLogSettings(this.page_settings);
		this.loadData();
	}

	/** Handles chart pagination page change */
	public onChartPage(page_index: number): void {
		this.page_settings.page = page_index;
		this.settingDeviceService.setEventLogSettings(this.page_settings);
		this.loadData();
	}

	/* *******************************************************
	   Agent
	******************************************************** */

	/** Opens the AI socket with current form context */
	private hireEventLogAgent(content: string | null): void {
		const section_options = Object.values(EventLogSection);
		const type_options = Object.values(EventLogType);
		const status_options = Object.values(EventLogStatus);
		let context = `* **Current Date:** ${DateTime.now().toFormat('yyyy-MM-dd')}\n`;
		context += `* **Date Start:** ${DateTime.fromSeconds(this.page_settings.date_start!).toFormat('yyyy-MM-dd')}\n`;
		context += `* **Date End:** ${DateTime.fromSeconds(this.page_settings.date_end!).toFormat('yyyy-MM-dd')}\n`;
		context += `* **Sections:** ${this.page_settings.sections.length > 0 ? this.page_settings.sections.join(', ') : 'all'}\n`;
		context += `* **Types:** ${this.page_settings.types.length > 0 ? this.page_settings.types.join(', ') : 'all'}\n`;
		context += `* **Statuses:** ${this.page_settings.statuses.length > 0 ? this.page_settings.statuses.join(', ') : 'all'}\n`;
		context += `* **Actor IDs:** ${this.page_settings.actor_ids.length > 0 ? this.page_settings.actor_ids.join(', ') : 'all'}\n`;
		context += `* **Available Sections:** ${section_options.join(', ')}\n`;
		context += `* **Available Types:** ${type_options.join(', ')}\n`;
		context += `* **Available Statuses:** ${status_options.join(', ')}\n`;
		context += `* **Available Users:** ${this.users()
			.map((u) => `${u.name} (${u.id})`)
			.join(', ')}`;
		this.aiService.openAiSocket(AiAgent.EventLog, content, context);
	}

	/** Executes the tool call from the AI agent */
	private executeAgentFunction(tool_call: AiChatToolCall): void {
		if (tool_call.function.name === AiFunctionName.DateRangeUpdate) {
			const range = [
				DateTime.fromFormat(tool_call.function.arguments.date_start, 'yyyy-MM-dd').toSeconds(),
				DateTime.fromFormat(tool_call.function.arguments.date_end, 'yyyy-MM-dd').toSeconds(),
			];
			this.onDateChange(range);
		}
		if (tool_call.function.name === AiFunctionName.EventLogSectionsUpdate) {
			const valid = tool_call.function.arguments.sections.every((s: string) =>
				Object.values(EventLogSection).includes(s as EventLogSection),
			);
			if (valid) this.onSectionsChange(tool_call.function.arguments.sections as EventLogSection[]);
		}
		if (tool_call.function.name === AiFunctionName.EventLogTypesUpdate) {
			const valid = tool_call.function.arguments.types.every((t: string) => Object.values(EventLogType).includes(t as EventLogType));
			if (valid) this.onTypesChange(tool_call.function.arguments.types as EventLogType[]);
		}
		if (tool_call.function.name === AiFunctionName.EventLogStatusesUpdate) {
			const valid = tool_call.function.arguments.statuses.every((s: string) =>
				Object.values(EventLogStatus).includes(s as EventLogStatus),
			);
			if (valid) this.onStatusesChange(tool_call.function.arguments.statuses as EventLogStatus[]);
		}
		if (tool_call.function.name === AiFunctionName.EventLogActorIdsUpdate) {
			const available_ids = this.users().map((u) => u.id);
			const valid = tool_call.function.arguments.actor_ids.every((id: string) => available_ids.includes(id));
			if (valid) this.onActorIdsChange(tool_call.function.arguments.actor_ids);
		}
		if (tool_call.function.name === AiFunctionName.EventLogResetFilters) {
			this.onResetFilter();
		}
	}

    /* *******************************************************
        Destroy
    ******************************************************** */

    ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}
}
