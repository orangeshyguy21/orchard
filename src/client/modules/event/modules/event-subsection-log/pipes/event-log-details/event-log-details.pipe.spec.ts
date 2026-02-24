/* Shared Dependencies */
import {EventLogType, EventLogDetailStatus} from '@shared/generated.types';
/* Application Dependencies */
import {EventLogDetail} from '@client/modules/event/classes/event-log.class';
/* Local Dependencies */
import {EventLogDetailsPipe} from './event-log-details.pipe';

/** Creates a minimal EventLogDetail for testing */
function createDetail(field: string): EventLogDetail {
	return new EventLogDetail({
		id: '1',
		field,
		old_value: null,
		new_value: null,
		status: EventLogDetailStatus.Success,
		error_code: null,
		error_message: null,
	});
}

describe('EventLogDetailsPipe', () => {
	const pipe = new EventLogDetailsPipe();

	it('create an instance', () => {
		expect(pipe).toBeTruthy();
	});

	it('should format detail with update type', () => {
		const detail = createDetail('max_amount');
		expect(pipe.transform(detail, EventLogType.Update)).toBe('max_amount updated');
	});

	it('should format detail with create type', () => {
		const detail = createDetail('unit');
		expect(pipe.transform(detail, EventLogType.Create)).toBe('unit set');
	});

	it('should format detail with delete type', () => {
		const detail = createDetail('keyset');
		expect(pipe.transform(detail, EventLogType.Delete)).toBe('keyset deleted');
	});

	it('should format detail with execute type', () => {
		const detail = createDetail('rotation');
		expect(pipe.transform(detail, EventLogType.Execute)).toBe('rotation executed');
	});

	it('should fall back to lowercase enum value for unknown type', () => {
		const detail = createDetail('something');
		expect(pipe.transform(detail, 'UNKNOWN' as EventLogType)).toBe('something unknown');
	});
});
