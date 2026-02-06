/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
/* Vendor Dependencies */
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
/* Application Dependencies */
import {OrcLocalModule} from '@client/modules/local/local.module';
import {OrcErrorModule} from '@client/modules/error/error.module';
import {OrcGraphicModule} from '@client/modules/graphic/graphic.module';
/* Local Dependencies */
import {BitcoinGeneralBlockComponent} from './components/bitcoin-general-block/bitcoin-general-block.component';
import {BitcoinGeneralUtxoStackComponent} from './components/bitcoin-general-utxo-stack/bitcoin-general-utxo-stack.component';
import {BitcoinGeneralBlockPipe} from './pipes/bitcoin-general-block/bitcoin-general-block.pipe';
import {BitcoinGeneralFeeratePipe} from './pipes/bitcoin-general-feerate/bitcoin-general-feerate.pipe';
import {BitcoinGeneralLog2workPipe} from './pipes/bitcoin-general-log2work/bitcoin-general-log2work.pipe';
import { BitcoinGeneralWalletSummaryComponent } from './components/bitcoin-general-wallet-summary/bitcoin-general-wallet-summary.component';

@NgModule({
	declarations: [
		BitcoinGeneralBlockComponent,
		BitcoinGeneralUtxoStackComponent,
		BitcoinGeneralBlockPipe,
		BitcoinGeneralFeeratePipe,
		BitcoinGeneralLog2workPipe,
        BitcoinGeneralWalletSummaryComponent,
	],
	imports: [CommonModule, MatIconModule, MatTooltipModule, MatCardModule, MatButtonModule, OrcLocalModule, OrcErrorModule, OrcGraphicModule],
	exports: [
		BitcoinGeneralBlockComponent,
		BitcoinGeneralUtxoStackComponent,
		BitcoinGeneralBlockPipe,
		BitcoinGeneralFeeratePipe,
		BitcoinGeneralLog2workPipe,
		BitcoinGeneralWalletSummaryComponent,
	],
})
export class OrcBitcoinGeneralModule {}
