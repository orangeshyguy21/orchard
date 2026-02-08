/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
/* Vendor Dependencies */
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatRippleModule} from '@angular/material/core';
/* Application Dependencies */
import {OrcLocalModule} from '@client/modules/local/local.module';
import {OrcErrorModule} from '@client/modules/error/error.module';
import {OrcGraphicModule} from '@client/modules/graphic/graphic.module';
import {OrcTimeModule} from '@client/modules/time/time.module';
import {OrcChartModule} from '@client/modules/chart/chart.module';
import {OrcDataModule} from '@client/modules/data/data.module';
/* Local Dependencies */
import {BitcoinGeneralBlockComponent} from './components/bitcoin-general-block/bitcoin-general-block.component';
import {BitcoinGeneralUtxoStackComponent} from './components/bitcoin-general-utxo-stack/bitcoin-general-utxo-stack.component';
import {BitcoinGeneralBlockPipe} from './pipes/bitcoin-general-block/bitcoin-general-block.pipe';
import {BitcoinGeneralFeeratePipe} from './pipes/bitcoin-general-feerate/bitcoin-general-feerate.pipe';
import {BitcoinGeneralLog2workPipe} from './pipes/bitcoin-general-log2work/bitcoin-general-log2work.pipe';
import {BitcoinGeneralWalletSummaryComponent} from './components/bitcoin-general-wallet-summary/bitcoin-general-wallet-summary.component';
import {BitcoinGeneralInfoComponent} from './components/bitcoin-general-info/bitcoin-general-info.component';

@NgModule({
	declarations: [
		BitcoinGeneralBlockComponent,
		BitcoinGeneralUtxoStackComponent,
		BitcoinGeneralBlockPipe,
		BitcoinGeneralFeeratePipe,
		BitcoinGeneralLog2workPipe,
		BitcoinGeneralWalletSummaryComponent,
		BitcoinGeneralInfoComponent,
	],
	imports: [
		CommonModule,
		MatIconModule,
		MatCardModule,
		MatButtonModule,
		MatRippleModule,
		OrcLocalModule,
		OrcErrorModule,
		OrcGraphicModule,
		OrcTimeModule,
		OrcChartModule,
		OrcDataModule,
	],
	exports: [
		BitcoinGeneralBlockComponent,
		BitcoinGeneralUtxoStackComponent,
		BitcoinGeneralBlockPipe,
		BitcoinGeneralFeeratePipe,
		BitcoinGeneralLog2workPipe,
		BitcoinGeneralWalletSummaryComponent,
		BitcoinGeneralInfoComponent,
	],
})
export class OrcBitcoinGeneralModule {}
