/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
/* Vendor Dependencies */
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
/* Application Dependencies */
import {OrcLocalModule} from '@client/modules/local/local.module';
/* Local Dependencies */
import {BitcoinGeneralBlockComponent} from './components/bitcoin-general-block/bitcoin-general-block.component';
import {BitcoinGeneralUtxoStackComponent} from './components/bitcoin-general-utxo-stack/bitcoin-general-utxo-stack.component';
import {BitcoinGeneralBlockPipe} from './pipes/bitcoin-general-block/bitcoin-general-block.pipe';
import {BitcoinGeneralFeeratePipe} from './pipes/bitcoin-general-feerate/bitcoin-general-feerate.pipe';
import {BitcoinGeneralLog2workPipe} from './pipes/bitcoin-general-log2work/bitcoin-general-log2work.pipe';

@NgModule({
	declarations: [
		BitcoinGeneralBlockComponent,
		BitcoinGeneralUtxoStackComponent,
		BitcoinGeneralBlockPipe,
		BitcoinGeneralFeeratePipe,
		BitcoinGeneralLog2workPipe,
	],
	imports: [CommonModule, MatIconModule, MatTooltipModule, OrcLocalModule],
	exports: [
		BitcoinGeneralBlockComponent,
		BitcoinGeneralUtxoStackComponent,
		BitcoinGeneralBlockPipe,
		BitcoinGeneralFeeratePipe,
		BitcoinGeneralLog2workPipe,
	],
})
export class OrcBitcoinGeneralModule {}
