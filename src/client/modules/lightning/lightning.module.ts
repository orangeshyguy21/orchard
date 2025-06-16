/* Core Dependencies */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/* Vendor Dependencies */
import { MatIconModule } from '@angular/material/icon';
/* Local Dependencies */
import { LightningChannelComponent } from './components/lightning-channel/lightning-channel.component';

@NgModule({
	declarations: [
		LightningChannelComponent
	],
	imports: [
		CommonModule,
		MatIconModule
	],
	exports: [
		LightningChannelComponent
	]
})
export class LightningModule { }