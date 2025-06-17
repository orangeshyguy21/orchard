/* Core Dependencies */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/* Application Dependencies */
import { NavModule } from '@client/modules/nav/nav.module';
/* Native Dependencies */
import { LightningSectionComponent } from './components/lightning-section/lightning-section.component';
/* Local Dependencies */
import { LightningAppRoutingModule } from './lightning-app.router';

@NgModule({
	declarations: [
		LightningSectionComponent
	],
	imports: [
		CommonModule,
		NavModule,
		LightningAppRoutingModule,
	],
})
export class LightningAppModule { }