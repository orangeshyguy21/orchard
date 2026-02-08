/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
/* Vendor Dependencies */
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatRadioModule} from '@angular/material/radio';
import {MatRippleModule} from '@angular/material/core';
import {MatMenuModule} from '@angular/material/menu';
/* Application Dependencies */
import {OrcGraphicModule} from '@client/modules/graphic/graphic.module';
import {OrcLocalModule} from '@client/modules/local/local.module';
import {OrcTimeModule} from '@client/modules/time/time.module';
/* Local Dependencies */
import {LightningGeneralChannelComponent} from './components/lightning-general-channel/lightning-general-channel.component';
import {LightningGeneralChannelSummaryComponent} from './components/lightning-general-channel-summary/lightning-general-channel-summary.component';

@NgModule({
	declarations: [LightningGeneralChannelComponent, LightningGeneralChannelSummaryComponent],
	imports: [
		CommonModule,
		MatIconModule,
		MatCardModule,
		MatButtonModule,
		MatRadioModule,
		MatRippleModule,
		MatMenuModule,
		OrcGraphicModule,
		OrcLocalModule,
		OrcTimeModule,
	],
	exports: [LightningGeneralChannelSummaryComponent],
})
export class OrcLightningGeneralModule {}
