/* Core Dependencies */
import {ChangeDetectionStrategy, Component, effect, input, output, signal, viewChild} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
/* Vendor Dependencies */
import {DateTime} from 'luxon';
import {MatMenuTrigger} from '@angular/material/menu';
import {MatSelectChange} from '@angular/material/select';
/* Application Dependencies */
import {AllEventLogSettings} from '@client/modules/settings/types/setting.types';
/* Shared Dependencies */
import {EventLogSection, EventLogActorType, EventLogType, EventLogStatus} from '@shared/generated.types';

@Component({
    selector: 'orc-event-subsection-log-control',
    standalone: false,
    templateUrl: './event-subsection-log-control.component.html',
    styleUrl: './event-subsection-log-control.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventSubsectionLogControlComponent {
    /* Inputs */
    public readonly date_start = input<number | null>();
    public readonly date_end = input<number | null>();
    public readonly section = input<EventLogSection | null>();
    public readonly actor_type = input<EventLogActorType | null>();
    public readonly type = input<EventLogType | null>();
    public readonly status = input<EventLogStatus | null>();
    public readonly device_desktop = input<boolean>();

    /* Outputs */
    public readonly dateChange = output<number[]>();
    public readonly sectionChange = output<EventLogSection | null>();
    public readonly actorTypeChange = output<EventLogActorType | null>();
    public readonly typeChange = output<EventLogType | null>();
    public readonly statusChange = output<EventLogStatus | null>();

    private readonly filter_menu_trigger = viewChild(MatMenuTrigger);

    /* Form */
    public readonly panel = new FormGroup({
        section: new FormControl<EventLogSection | null>(null),
        actor_type: new FormControl<EventLogActorType | null>(null),
        type: new FormControl<EventLogType | null>(null),
        status: new FormControl<EventLogStatus | null>(null),
        daterange: new FormGroup({
            date_start: new FormControl<DateTime | null>(null, [Validators.required]),
            date_end: new FormControl<DateTime | null>(null, [Validators.required]),
        }),
    });

    /* Enum options */
    public readonly section_options = Object.values(EventLogSection);
    public readonly actor_type_options = Object.values(EventLogActorType);
    public readonly type_options = Object.values(EventLogType);
    public readonly status_options = Object.values(EventLogStatus);

    /* State */
    public readonly filter_count = signal(0);

    public get height_state(): string {
        return this.panel?.invalid ? 'invalid' : 'valid';
    }

    constructor() {
        this.panel
            .get('daterange')
            ?.statusChanges.pipe(takeUntilDestroyed())
            .subscribe(() => {});

        /* Sync inputs to form */
        effect(() => {
            const ds = this.date_start();
            if (ds) this.panel.controls.daterange.controls.date_start.setValue(DateTime.fromSeconds(ds), {emitEvent: false});
        });
        effect(() => {
            const de = this.date_end();
            if (de) this.panel.controls.daterange.controls.date_end.setValue(DateTime.fromSeconds(de), {emitEvent: false});
        });
        effect(() => {
            const s = this.section();
            this.panel.controls.section.setValue(s ?? null, {emitEvent: false});
        });
        effect(() => {
            const at = this.actor_type();
            this.panel.controls.actor_type.setValue(at ?? null, {emitEvent: false});
        });
        effect(() => {
            const t = this.type();
            this.panel.controls.type.setValue(t ?? null, {emitEvent: false});
        });
        effect(() => {
            const s = this.status();
            this.panel.controls.status.setValue(s ?? null, {emitEvent: false});
        });
    }

    /* *******************************************************
        Events
    ******************************************************** */

    /** Emits date range change when both dates are valid */
    public onDateChange(): void {
        const daterange = this.panel.controls.daterange;
        if (daterange.invalid) return;
        const ds = daterange.controls.date_start.value;
        const de = daterange.controls.date_end.value;
        if (!ds || !de) return;
        this.dateChange.emit([Math.floor(ds.startOf('day').toSeconds()), Math.floor(de.endOf('day').toSeconds())]);
    }

    /** Handles section select change */
    public onSectionChange(event: MatSelectChange): void {
        this.sectionChange.emit(event.value);
    }

    /** Handles actor type select change */
    public onActorTypeChange(event: MatSelectChange): void {
        this.actorTypeChange.emit(event.value);
        this.updateFilterCount();
    }

    /** Handles change type select change */
    public onTypeChange(event: MatSelectChange): void {
        this.typeChange.emit(event.value);
        this.updateFilterCount();
    }

    /** Handles status select change */
    public onStatusChange(event: MatSelectChange): void {
        this.statusChange.emit(event.value);
        this.updateFilterCount();
    }

    /** Clears all filters in the menu */
    public onClearFilter(): void {
        this.panel.controls.actor_type.setValue(null);
        this.panel.controls.type.setValue(null);
        this.panel.controls.status.setValue(null);
        this.actorTypeChange.emit(null);
        this.typeChange.emit(null);
        this.statusChange.emit(null);
        this.filter_count.set(0);
    }

    /** Closes the filter menu */
    public onCloseFilter(): void {
        this.filter_menu_trigger()?.closeMenu();
    }

    /** Counts active filter groups for badge display */
    private updateFilterCount(): void {
        let count = 0;
        if (this.panel.controls.actor_type.value) count++;
        if (this.panel.controls.type.value) count++;
        if (this.panel.controls.status.value) count++;
        this.filter_count.set(count);
    }
}
