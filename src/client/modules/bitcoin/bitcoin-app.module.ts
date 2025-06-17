/* Core Dependencies */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/* Application Dependencies */
import { NavModule } from '@client/modules/nav/nav.module';
/* Native Dependencies */
import { BitcoinSectionComponent } from './components/bitcoin-section/bitcoin-section.component';
import { BitcoinSubsectionDashboardComponent } from './components/bitcoin-subsection-dashboard/bitcoin-subsection-dashboard.component';
import { BitcoinSubsectionDisabledComponent } from './components/bitcoin-subsection-disabled/bitcoin-subsection-disabled.component';
/* Local Dependencies */
import { BitcoinAppRoutingModule } from './bitcoin-app.router';


@NgModule({
	declarations: [
		BitcoinSectionComponent,
		BitcoinSubsectionDashboardComponent,
		BitcoinSubsectionDisabledComponent,
	],
	imports: [
		CommonModule,
		NavModule,
		BitcoinAppRoutingModule,
	],
})
export class BitcoinAppModule { }