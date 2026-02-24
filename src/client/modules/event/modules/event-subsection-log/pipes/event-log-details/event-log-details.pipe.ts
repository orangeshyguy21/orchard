/* Core Dependencies */
import {Pipe, PipeTransform} from '@angular/core';
/* Shared Dependencies */
import {EventLogType} from '@shared/generated.types';
/* Application Dependencies */
import {EventLogDetail} from '@client/modules/event/classes/event-log.class';

/** Maps EventLogType enum values to past-tense verbs */
const TYPE_PAST: Record<EventLogType, string> = {
    [EventLogType.Create]: 'set',
    [EventLogType.Delete]: 'deleted',
    [EventLogType.Execute]: 'executed',
    [EventLogType.Update]: 'updated',
};

@Pipe({
    name: 'eventLogDetails',
    standalone: false,
    pure: true,
})
export class EventLogDetailsPipe implements PipeTransform {
    /** Transforms a single event log detail into a summary string (e.g. "max_amount updated") */
    transform(detail: EventLogDetail, type: EventLogType): string {
        const verb = TYPE_PAST[type] ?? type.toLowerCase();
        return `${detail.field} ${verb}`;
    }
}
