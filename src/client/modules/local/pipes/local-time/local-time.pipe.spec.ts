/* Local Dependencies */
import {LocalTimePipe} from './local-time.pipe';

describe('LocalTimePipe', () => {
	it('create an instance', () => {
		const mock_setting_service = {getTimezone: () => 'UTC', getLocale: () => 'en-US'};
		const pipe = new LocalTimePipe(mock_setting_service as any);
		expect(pipe).toBeTruthy();
	});
});
