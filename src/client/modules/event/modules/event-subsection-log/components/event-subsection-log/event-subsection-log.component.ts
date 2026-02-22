/* Core Dependencies */
import {ChangeDetectionStrategy, Component, inject, signal, OnInit} from '@angular/core';
/* Vendor Dependencies */
import {DateTime} from 'luxon';
/* Application Dependencies */
import {SettingDeviceService} from '@client/modules/settings/services/setting-device/setting-device.service';
import {AllEventLogSettings} from '@client/modules/settings/types/setting.types';
/* Native Dependencies */
import {EventLogService} from '@client/modules/event/services/event-log/event-log.service';
import {EventLog} from '@client/modules/event/classes/event-log.class';

@Component({
	selector: 'orc-event-subsection-log',
	standalone: false,
	templateUrl: './event-subsection-log.component.html',
	styleUrl: './event-subsection-log.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventSubsectionLogComponent implements OnInit {
    private readonly eventLogService = inject(EventLogService);
    private readonly settingDeviceService = inject(SettingDeviceService);

    public readonly page_settings = signal<AllEventLogSettings | null>(null);
    public readonly event_logs = signal<EventLog[]>([]);
    

    constructor() {
        this.eventLogService.getEventLogs().subscribe((event_logs) => {
            console.log('event_logs', event_logs);
            this.event_logs.set(event_logs);
        });
    }

    ngOnInit(): void {
        this.page_settings.set(this.getPageSettings());
        console.log('page_settings', this.page_settings());
    }

    /* *******************************************************
		Controls                      
	******************************************************** */

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
            page: settings.page ?? 1,
			page_size: settings.page_size ?? 100,
		};
	}

    private getDefaultDateStart(): number {
        return Math.floor(DateTime.now().minus({days: 30}).startOf('day').toSeconds());
    }

    private getDefaultDateEnd(): number {
		const today = DateTime.now().endOf('day');
		return Math.floor(today.toSeconds());
	}
}
