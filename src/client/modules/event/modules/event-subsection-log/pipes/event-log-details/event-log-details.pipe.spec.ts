/* Shared Dependencies */
import {EventLogType} from '@shared/generated.types';
/* Local Dependencies */
import {EventLogDetailsPipe} from './event-log-details.pipe';

describe('EventLogDetailsPipe', () => {
    const pipe = new EventLogDetailsPipe();

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should use singular form for count of 1', () => {
        expect(pipe.transform(1, EventLogType.Update)).toBe('1 update');
        expect(pipe.transform(1, EventLogType.Create)).toBe('1 create');
    });

    it('should use plural form for count greater than 1', () => {
        expect(pipe.transform(2, EventLogType.Update)).toBe('2 updates');
        expect(pipe.transform(5, EventLogType.Delete)).toBe('5 deletes');
    });

    it('should handle all event types', () => {
        expect(pipe.transform(3, EventLogType.Create)).toBe('3 creates');
        expect(pipe.transform(3, EventLogType.Delete)).toBe('3 deletes');
        expect(pipe.transform(3, EventLogType.Execute)).toBe('3 executes');
        expect(pipe.transform(3, EventLogType.Update)).toBe('3 updates');
    });

    it('should handle zero count', () => {
        expect(pipe.transform(0, EventLogType.Update)).toBe('0 updates');
    });

    it('should fall back to raw enum value for unknown type', () => {
        expect(pipe.transform(2, 'UNKNOWN' as EventLogType)).toBe('2 UNKNOWN');
    });
});
