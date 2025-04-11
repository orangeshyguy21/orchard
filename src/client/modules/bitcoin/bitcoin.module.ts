/* Core Dependencies */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/* Local Dependencies */
import { BlockPipe } from './pipes/block/block.pipe';

@NgModule({
	declarations: [
		BlockPipe
	],
	imports: [
		CommonModule
	],
	exports: [
		BlockPipe
	]
})
export class BitcoinModule { }