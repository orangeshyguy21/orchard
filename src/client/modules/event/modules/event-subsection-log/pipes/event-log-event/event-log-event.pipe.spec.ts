/* Shared Dependencies */
import {EventLogEntityType, EventLogType} from '@shared/generated.types';
/* Local Dependencies */
import {EventLogEventPipe} from './event-log-event.pipe';

describe('EventLogEventPipe', () => {
    const pipe = new EventLogEventPipe();

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should format entity type and event type into readable string', () => {
        expect(pipe.transform(EventLogEntityType.QuoteTtl, EventLogType.Update)).toBe('Quote TTL Updated');
        expect(pipe.transform(EventLogEntityType.Info, EventLogType.Create)).toBe('Info Created');
        expect(pipe.transform(EventLogEntityType.Keyset, EventLogType.Delete)).toBe('Keyset Deleted');
        expect(pipe.transform(EventLogEntityType.Database, EventLogType.Execute)).toBe('Database Executed');
    });

    it('should handle all entity types', () => {
        expect(pipe.transform(EventLogEntityType.Nut04, EventLogType.Update)).toBe('Nut04 Updated');
        expect(pipe.transform(EventLogEntityType.Nut05, EventLogType.Update)).toBe('Nut05 Updated');
        expect(pipe.transform(EventLogEntityType.Quote, EventLogType.Create)).toBe('Quote Created');
    });

    it('should fall back to raw enum value for unknown types', () => {
        expect(pipe.transform('UNKNOWN' as EventLogEntityType, EventLogType.Update)).toBe('UNKNOWN Updated');
        expect(pipe.transform(EventLogEntityType.Info, 'UNKNOWN' as EventLogType)).toBe('Info UNKNOWN');
    });
});
