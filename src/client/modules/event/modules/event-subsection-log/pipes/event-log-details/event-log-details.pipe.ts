/* Core Dependencies */
import {Pipe, PipeTransform} from '@angular/core';
/* Shared Dependencies */
import {EventLogType} from '@shared/generated.types';

/** Maps EventLogType enum values to singular/plural noun forms */
const TYPE_SINGULAR: Record<EventLogType, string> = {
    [EventLogType.Create]: 'create',
    [EventLogType.Delete]: 'delete',
    [EventLogType.Execute]: 'execute',
    [EventLogType.Update]: 'update',
};

const TYPE_PLURAL: Record<EventLogType, string> = {
    [EventLogType.Create]: 'creates',
    [EventLogType.Delete]: 'deletes',
    [EventLogType.Execute]: 'executes',
    [EventLogType.Update]: 'updates',
};

@Pipe({
    name: 'eventLogDetails',
    standalone: false,
    pure: true,
})
export class EventLogDetailsPipe implements PipeTransform {
    /** Transforms a detail count + event type into a summary string (e.g. "2 updates") */
    transform(count: number, type: EventLogType): string {
        const label = count === 1 ? (TYPE_SINGULAR[type] ?? type) : (TYPE_PLURAL[type] ?? type);
        return `${count} ${label}`;
    }
}
