/* Core Dependencies */
import {NgModule} from '@angular/core';
/* Native Dependencies */
import {BitcoinGeneralBlockPipe} from './pipes/bitcoin-general-block/bitcoin-general-block.pipe';

@NgModule({
	declarations: [BitcoinGeneralBlockPipe],
	exports: [BitcoinGeneralBlockPipe],
})
export class OrcBitcoinGeneralBlockPipeModule {}
