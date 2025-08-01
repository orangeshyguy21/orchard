/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
/* Vendor Dependencies */
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
/* Application Dependencies */
import {NavModule} from '@client/modules/nav/nav.module';
import {SettingsModule} from '@client/modules/settings/settings.module';
/* Native Dependencies */
import {BitcoinSectionComponent} from './components/bitcoin-section/bitcoin-section.component';
import {BitcoinSubsectionDashboardComponent} from './components/bitcoin-subsection-dashboard/bitcoin-subsection-dashboard.component';
import {BitcoinSubsectionDisabledComponent} from './components/bitcoin-subsection-disabled/bitcoin-subsection-disabled.component';
/* Local Dependencies */
import {BitcoinAppRoutingModule} from './bitcoin-app.router';

@NgModule({
	declarations: [BitcoinSectionComponent, BitcoinSubsectionDashboardComponent, BitcoinSubsectionDisabledComponent],
	imports: [CommonModule, MatIconModule, MatButtonModule, NavModule, SettingsModule, BitcoinAppRoutingModule],
})
export class BitcoinAppModule {}
