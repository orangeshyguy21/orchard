/* Core Dependencies */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/* Native Module Dependencies */
import { GraphicOrchardLogoComponent } from './components/graphic-orchard-logo/graphic-orchard-logo.component';
import { GraphicBitcoinComponent } from './components/graphic-bitcoin/graphic-bitcoin.component';
import { GraphicAssetComponent } from './components/graphic-asset/graphic-asset.component';

@NgModule({
	declarations: [
		GraphicOrchardLogoComponent,
  		GraphicBitcoinComponent,
    	GraphicAssetComponent
	],
	imports: [
		CommonModule,
	],
	exports: [
		GraphicOrchardLogoComponent,
		GraphicAssetComponent
	]
})
export class GraphicModule { }