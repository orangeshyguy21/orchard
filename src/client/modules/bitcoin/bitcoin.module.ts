/* Core Dependencies */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/* Vendor Dependencies */
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
/* Local Dependencies */
import { BlockPipe } from './pipes/block/block.pipe';
import { Log2WorkPipe } from './pipes/log2work/log2work.pipe';
import { FeeratePipe } from './pipes/feerate/feerate.pipe';
import { BitcoinUtxoStackComponent } from './components/bitcoin-utxo-stack/bitcoin-utxo-stack.component';

@NgModule({
	declarations: [
		BlockPipe,
		Log2WorkPipe,
		FeeratePipe,
		BitcoinUtxoStackComponent
	],
	imports: [
		CommonModule,
		MatIconModule,
		MatTooltipModule,
	],
	exports: [
		BlockPipe,
		Log2WorkPipe,
		FeeratePipe,
		BitcoinUtxoStackComponent
	]
})
export class BitcoinModule { }