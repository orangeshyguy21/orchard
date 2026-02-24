/* Core Dependencies */
import {ChangeDetectionStrategy, Component, OnInit, OnDestroy, inject, signal, computed} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
/* Vendor Dependencies */
import {DateTime} from 'luxon';
import {Subscription, finalize} from 'rxjs';
import {PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
/* Application Dependencies */
import {SettingDeviceService} from '@client/modules/settings/services/setting-device/setting-device.service';
import {AllEventLogSettings} from '@client/modules/settings/types/setting.types';
import {DeviceType} from '@client/modules/layout/types/device.types';
import {CrewService} from '@client/modules/crew/services/crew/crew.service';
import {User} from '@client/modules/crew/classes/user.class';
/* Native Dependencies */
import {EventLogService} from '@client/modules/event/services/event-log/event-log.service';
import {EventLog} from '@client/modules/event/classes/event-log.class';
/* Shared Dependencies */
import {EventLogSection, EventLogType, EventLogStatus, QueryEvent_LogsArgs} from '@shared/generated.types';

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
	private readonly crewService = inject(CrewService);
	private readonly breakpointObserver = inject(BreakpointObserver);

	public page_settings!: AllEventLogSettings;
	public data_source = new MatTableDataSource<EventLog>([]);

	public readonly device_type = signal<DeviceType>('desktop');
	public readonly users = signal<User[]>([]);
	public readonly error = signal<boolean>(false);
	public readonly count = signal<number>(0);
	public readonly id_user = signal<string | null>(null);
	public readonly locale = signal<string>(this.settingDeviceService.getLocale());

	private readonly loading_users = signal<boolean>(true);
	private readonly loading_events = signal<boolean>(true);
	public readonly loading = computed(() => this.loading_users() || this.loading_events());

	private subscriptions = new Subscription();

	ngOnInit(): void {
		this.page_settings = this.getPageSettings();
		this.subscriptions.add(this.getBreakpointSubscription());
		this.subscriptions.add(this.getUserSubscription());
		this.loadUsers();
		this.loadData();
	}

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}

	/* *******************************************************
        Settings
    ******************************************************** */

	/** Merges long-term and short-term settings with defaults */
	private getPageSettings(): AllEventLogSettings {
		const settings = this.settingDeviceService.getEventLogSettings();
		return {
			sections: settings.sections ?? [],
			actor_types: settings.actor_types ?? [],
			actor_ids: settings.actor_ids ?? [],
			types: settings.types ?? [],
			statuses: settings.statuses ?? [],
			date_start: settings.date_start ?? this.getDefaultDateStart(),
			date_end: settings.date_end ?? this.getDefaultDateEnd(),
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
		this.page_settings.date_start = event[0];
		this.page_settings.date_end = event[1];
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
}
