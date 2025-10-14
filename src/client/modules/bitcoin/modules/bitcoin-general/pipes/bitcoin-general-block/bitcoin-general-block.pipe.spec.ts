import {BitcoinGeneralBlockPipe} from './bitcoin-general-block.pipe';

describe('BitcoinGeneralBlockPipe', () => {
	it('create an instance', () => {
		const pipe = new BitcoinGeneralBlockPipe();
		expect(pipe).toBeTruthy();
	});
});
