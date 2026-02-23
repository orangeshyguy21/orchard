/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
/* Vendor Dependencies */
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatRippleModule} from '@angular/material/core';
import {MatChipsModule} from '@angular/material/chips';
/* Application Dependencies */
import {OrcNetworkModule} from '@client/modules/network/network.module';
import {OrcGraphicModule} from '@client/modules/graphic/graphic.module';
import {OrcLocalModule} from '@client/modules/local/local.module';
import {OrcErrorModule} from '@client/modules/error/error.module';
import {OrcTimeModule} from '@client/modules/time/time.module';
import {OrcChartModule} from '@client/modules/chart/chart.module';
/* Local Dependencies */
import {MintGeneralIconComponent} from './components/mint-general-icon/mint-general-icon.component';
import {MintGeneralNameComponent} from './components/mint-general-name/mint-general-name.component';
import {MintGeneralKeysetComponent} from './components/mint-general-keyset/mint-general-keyset.component';
import {MintGeneralBalanceSheetComponent} from './components/mint-general-balance-sheet/mint-general-balance-sheet.component';
import {MintGeneralInfoComponent} from './components/mint-general-info/mint-general-info.component';
import {MintGeneralBalanceStacksComponent} from './components/mint-general-balance-stacks/mint-general-balance-stacks.component';
import {MintGeneralKeysetVersionComponent} from './components/mint-general-keyset-version/mint-general-keyset-version.component';
import {MintGeneralKeysetsSummaryComponent} from './components/mint-general-keysets-summary/mint-general-keysets-summary.component';
import {MintGeneralConfigSummaryComponent} from './components/mint-general-config-summary/mint-general-config-summary.component';
import {MintGeneralHealthComponent} from './components/mint-general-health/mint-general-health.component';

@NgModule({
	declarations: [
		MintGeneralIconComponent,
		MintGeneralNameComponent,
		MintGeneralKeysetComponent,
		MintGeneralBalanceSheetComponent,
		MintGeneralInfoComponent,
		MintGeneralBalanceStacksComponent,
		MintGeneralKeysetVersionComponent,
		MintGeneralKeysetsSummaryComponent,
		MintGeneralConfigSummaryComponent,
		MintGeneralHealthComponent,
	],
	imports: [
		CommonModule,
		MatIconModule,
		MatCardModule,
		MatTableModule,
		MatButtonModule,
		MatRippleModule,
		MatChipsModule,
		OrcNetworkModule,
		OrcGraphicModule,
		OrcLocalModule,
		OrcErrorModule,
		OrcTimeModule,
		OrcChartModule,
	],
	exports: [
		MintGeneralIconComponent,
		MintGeneralNameComponent,
		MintGeneralKeysetComponent,
		MintGeneralBalanceSheetComponent,
		MintGeneralInfoComponent,
		MintGeneralKeysetVersionComponent,
		MintGeneralKeysetsSummaryComponent,
		MintGeneralConfigSummaryComponent,
		MintGeneralHealthComponent,
	],
})
export class OrcMintGeneralModule {}
