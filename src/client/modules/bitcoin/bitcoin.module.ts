/* Core Dependencies */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/* Vendor Dependencies */
import { MatIconModule } from '@angular/material/icon';
/* Local Dependencies */
import { BlockPipe } from './pipes/block/block.pipe';
import { Log2WorkPipe } from './pipes/log2work/log2work.pipe';
import { BitcoinUtxoStackComponent } from './components/bitcoin-utxo-stack/bitcoin-utxo-stack.component';

@NgModule({
	declarations: [
		BlockPipe,
		Log2WorkPipe,
		BitcoinUtxoStackComponent
	],
	imports: [
		CommonModule,
		MatIconModule
	],
	exports: [
		BlockPipe,
		Log2WorkPipe,
		BitcoinUtxoStackComponent
	]
})
export class BitcoinModule { }