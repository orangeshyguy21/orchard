/* Core Dependencies */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphicOrchardLogoComponent } from './components/orchard-logo/graphic-orchard-logo.component';

@NgModule({
	declarations: [
		GraphicOrchardLogoComponent
	],
	imports: [
		CommonModule,
	],
	exports: [
		GraphicOrchardLogoComponent
	]
})
export class GraphicModule { }