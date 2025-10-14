/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
/* Vendor Dependencies */
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {MatCardModule} from '@angular/material/card';
/* Application Dependencies */
import {OrcGraphicModule} from '@client/modules/graphic/graphic.module';
import {OrcLocalModule} from '@client/modules/local/local.module';
/* Local Dependencies */
import {LightningGeneralChannelComponent} from './components/lightning-general-channel/lightning-general-channel.component';
import {LightningGeneralChannelTableComponent} from './components/lightning-general-channel-table/lightning-general-channel-table.component';

@NgModule({
	declarations: [LightningGeneralChannelComponent, LightningGeneralChannelTableComponent],
	imports: [CommonModule, MatIconModule, MatTableModule, MatCardModule, OrcGraphicModule, OrcLocalModule],
	exports: [LightningGeneralChannelComponent, LightningGeneralChannelTableComponent],
})
export class OrcLightningGeneralModule {}
