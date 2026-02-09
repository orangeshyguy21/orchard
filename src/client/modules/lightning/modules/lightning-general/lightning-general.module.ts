/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule as CoreCommonModule} from '@angular/common';
import {ReactiveFormsModule as CoreReactiveFormsModule} from '@angular/forms';
/* Vendor Dependencies */
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatRadioModule} from '@angular/material/radio';
import {MatRippleModule} from '@angular/material/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatChipsModule} from '@angular/material/chips';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
/* Application Dependencies */
import {OrcGraphicModule} from '@client/modules/graphic/graphic.module';
import {OrcLocalModule} from '@client/modules/local/local.module';
import {OrcTimeModule} from '@client/modules/time/time.module';
import {OrcChartModule} from '@client/modules/chart/chart.module';
import {OrcDataModule} from '@client/modules/data/data.module';
/* Local Dependencies */
import {LightningGeneralChannelComponent} from './components/lightning-general-channel/lightning-general-channel.component';
import {LightningGeneralChannelSummaryComponent} from './components/lightning-general-channel-summary/lightning-general-channel-summary.component';
import {LightningGeneralInfoComponent} from './components/lightning-general-info/lightning-general-info.component';
import {LightningGeneralConnectionComponent} from './components/lightning-general-connection/lightning-general-connection.component';

@NgModule({
	declarations: [
		LightningGeneralChannelComponent,
		LightningGeneralChannelSummaryComponent,
		LightningGeneralInfoComponent,
		LightningGeneralConnectionComponent,
	],
	imports: [
		CoreCommonModule,
		CoreReactiveFormsModule,
		MatIconModule,
		MatCardModule,
		MatButtonModule,
		MatRadioModule,
		MatRippleModule,
		MatMenuModule,
		MatChipsModule,
		MatDialogModule,
		MatSliderModule,
		MatSlideToggleModule,
		OrcGraphicModule,
		OrcLocalModule,
		OrcTimeModule,
		OrcChartModule,
		OrcDataModule,
	],
	exports: [LightningGeneralChannelSummaryComponent, LightningGeneralInfoComponent],
})
export class OrcLightningGeneralModule {}
