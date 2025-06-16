/* Core Dependencies */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/* Vendor Dependencies */
import { MatIconModule } from '@angular/material/icon';
/* Local Dependencies */
import { MintIconComponent } from './components/mint-icon/mint-icon.component';

@NgModule({
	declarations: [
		MintIconComponent
	],
	imports: [
		CommonModule,
		MatIconModule,
	],
	exports: [
		MintIconComponent
	]
})
export class MintModule { }