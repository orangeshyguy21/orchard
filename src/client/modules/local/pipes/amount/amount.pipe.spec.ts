/* Local Dependencies */
import {LocalAmountPipe} from './amount.pipe';

describe('LocalAmountPipe', () => {
	it('create an instance', () => {
		const mock_setting_service = {getLocale: () => 'en-US'};
		const pipe = new LocalAmountPipe(mock_setting_service as any);
		expect(pipe).toBeTruthy();
	});
});
