/* Local Dependencies */
import {TimePipe} from './time.pipe';

describe('TimePipe', () => {
	it('create an instance', () => {
		const mock_setting_service = {getTimezone: () => 'UTC', getLocale: () => 'en-US'};
		const pipe = new TimePipe(mock_setting_service as any);
		expect(pipe).toBeTruthy();
	});
});
