/* Core Dependencies */
import {Pipe, PipeTransform} from '@angular/core';
/* Shared Dependencies */
import {EventLogType} from '@shared/generated.types';
/* Application Dependencies */
import {EventLogDetail} from '@client/modules/event/classes/event-log.class';

/** Maps EventLogType enum values to past-tense verbs */
const TYPE_PAST: Record<EventLogType, string> = {
    [EventLogType.Create]: 'created',
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
    /** Transforms event log details into summary strings (e.g. "sat bolt11 max_amount updated") */
    transform(details: EventLogDetail[], entity_id: string | null, type: EventLogType): string[] {
        const verb = TYPE_PAST[type] ?? type.toLowerCase();
        return details.map((detail) => {
            const parts: string[] = [];
            if (entity_id) {
                parts.push(entity_id.replaceAll(':', ' '));
            }
            parts.push(detail.field);
            parts.push(verb);
            return parts.join(' ');
        });
    }
}
