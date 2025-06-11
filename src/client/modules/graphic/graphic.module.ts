/* Core Dependencies */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/* Vendor Dependencies */
import { MatIconModule } from '@angular/material/icon';
/* Native Module Dependencies */
import { GraphicOrchardLogoComponent } from './components/graphic-orchard-logo/graphic-orchard-logo.component';
import { GraphicAssetComponent } from './components/graphic-asset/graphic-asset.component';

@NgModule({
	declarations: [
		GraphicOrchardLogoComponent,
    	GraphicAssetComponent,
	],
	imports: [
		CommonModule,
		MatIconModule,
	],
	exports: [
		GraphicOrchardLogoComponent,
		GraphicAssetComponent
	]
})
export class GraphicModule { }