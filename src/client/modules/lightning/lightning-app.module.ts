/* Core Dependencies */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/* Vendor Dependencies */
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
/* Application Dependencies */
import { NavModule } from '@client/modules/nav/nav.module';
/* Native Dependencies */
import { LightningSectionComponent } from './components/lightning-section/lightning-section.component';
import { LightningSubsectionDisabledComponent } from './components/lightning-subsection-disabled/lightning-subsection-disabled.component';
import { LightningSubsectionDashboardComponent } from './components/lightning-subsection-dashboard/lightning-subsection-dashboard.component';
/* Local Dependencies */
import { LightningAppRoutingModule } from './lightning-app.router';

@NgModule({
	declarations: [
		LightningSectionComponent,
		LightningSubsectionDisabledComponent,
		LightningSubsectionDashboardComponent
	],
	imports: [
		CommonModule,
		MatIconModule,
		MatButtonModule,
		NavModule,
		LightningAppRoutingModule,
	],
})
export class LightningAppModule { }