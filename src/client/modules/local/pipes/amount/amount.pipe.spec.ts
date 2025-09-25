/* Local Dependencies */
import {AmountPipe} from './amount.pipe';

describe('AmountPipe', () => {
	it('create an instance', () => {
		const mock_setting_service = {getLocale: () => 'en-US'};
		const pipe = new AmountPipe(mock_setting_service as any);
		expect(pipe).toBeTruthy();
	});
});
