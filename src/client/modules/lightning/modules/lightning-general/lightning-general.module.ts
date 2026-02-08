/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
/* Vendor Dependencies */
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
/* Application Dependencies */
import {OrcGraphicModule} from '@client/modules/graphic/graphic.module';
import {OrcLocalModule} from '@client/modules/local/local.module';
import {OrcTimeModule} from '@client/modules/time/time.module';
/* Local Dependencies */
import {LightningGeneralChannelComponent} from './components/lightning-general-channel/lightning-general-channel.component';
import {LightningGeneralChannelSummaryComponent} from './components/lightning-general-channel-summary/lightning-general-channel-summary.component';

@NgModule({
	declarations: [LightningGeneralChannelComponent, LightningGeneralChannelSummaryComponent],
	imports: [CommonModule, MatIconModule, MatCardModule, MatButtonModule, OrcGraphicModule, OrcLocalModule, OrcTimeModule],
	exports: [LightningGeneralChannelComponent, LightningGeneralChannelSummaryComponent],
})
export class OrcLightningGeneralModule {}
