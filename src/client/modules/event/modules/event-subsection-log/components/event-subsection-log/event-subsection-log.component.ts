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
import {EventLogSection, EventLogActorType, EventLogType, EventLogStatus, QueryEvent_LogsArgs} from '@shared/generated.types';

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

    private readonly loading_users = signal<boolean>(true);
    private readonly loading_events = signal<boolean>(true);
    public readonly loading = computed(() => this.loading_users() || this.loading_events());

    private subscriptions = new Subscription();

    ngOnInit(): void {
        this.page_settings = this.getPageSettings();
        this.subscriptions.add(this.getBreakpointSubscription());
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
            section: settings.section ?? null,
            actor_type: settings.actor_type ?? null,
            actor_id: settings.actor_id ?? null,
            type: settings.type ?? null,
            status: settings.status ?? null,
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
        Breakpoint
    ******************************************************** */

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
            section: this.page_settings.section ?? undefined,
            actor_type: this.page_settings.actor_type ?? undefined,
            actor_id: this.page_settings.actor_id ?? undefined,
            type: this.page_settings.type ?? undefined,
            status: this.page_settings.status ?? undefined,
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

    /** Handles section filter change */
    public onSectionChange(section: EventLogSection | null): void {
        this.page_settings.section = section;
        this.page_settings.page = 0;
        this.settingDeviceService.setEventLogSettings(this.page_settings);
        this.loadData();
    }

    /** Handles actor type filter change */
    public onActorTypeChange(actor_type: EventLogActorType | null): void {
        this.page_settings.actor_type = actor_type;
        this.page_settings.page = 0;
        this.settingDeviceService.setEventLogSettings(this.page_settings);
        this.loadData();
    }

    /** Handles change type filter change */
    public onTypeChange(type: EventLogType | null): void {
        this.page_settings.type = type;
        this.page_settings.page = 0;
        this.settingDeviceService.setEventLogSettings(this.page_settings);
        this.loadData();
    }

    /** Handles status filter change */
    public onStatusChange(status: EventLogStatus | null): void {
        this.page_settings.status = status;
        this.page_settings.page = 0;
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
}
