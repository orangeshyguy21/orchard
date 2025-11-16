import {TimeUtcPipe} from './time-utc.pipe';

describe('TimeUtcPipe', () => {
	it('create an instance', () => {
		const pipe = new TimeUtcPipe();
		expect(pipe).toBeTruthy();
	});
});
