import {BitcoinGeneralFeeratePipe} from './bitcoin-general-feerate.pipe';

describe('FeeratePipe', () => {
	it('create an instance', () => {
		const pipe = new BitcoinGeneralFeeratePipe();
		expect(pipe).toBeTruthy();
	});
});
