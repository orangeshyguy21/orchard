/* Core Dependencies */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/* Vendor Dependencies */
import { MatIconModule } from '@angular/material/icon';
/* Local Dependencies */
import { BlockPipe } from './pipes/block/block.pipe';
import { BitcoinUtxoStackComponent } from './components/bitcoin-utxo-stack/bitcoin-utxo-stack.component';

@NgModule({
	declarations: [
		BlockPipe,
		BitcoinUtxoStackComponent
	],
	imports: [
		CommonModule,
		MatIconModule
	],
	exports: [
		BlockPipe,
		BitcoinUtxoStackComponent
	]
})
export class BitcoinModule { }