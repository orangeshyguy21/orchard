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
import {LightningChannelComponent} from './components/lightning-channel/lightning-channel.component';
import {LightningChannelTableComponent} from './components/lightning-channel-table/lightning-channel-table.component';

@NgModule({
	declarations: [LightningChannelComponent, LightningChannelTableComponent],
	imports: [CommonModule, MatIconModule, MatTableModule, MatCardModule, OrcGraphicModule, OrcLocalModule],
	exports: [LightningChannelComponent, LightningChannelTableComponent],
})
export class LightningModule {}
