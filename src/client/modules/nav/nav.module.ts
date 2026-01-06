/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
/* Vendor Dependencies */
import {MatIconModule} from '@angular/material/icon';
import {MatRippleModule} from '@angular/material/core';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {DragDropModule} from '@angular/cdk/drag-drop';
/* Application Dependencies */
import {OrcGraphicModule} from '@client/modules/graphic/graphic.module';
import {OrcBitcoinGeneralModule} from '@client/modules/bitcoin/modules/bitcoin-general/bitcoin-general.module';
import {OrcEventGeneralModule} from '@client/modules/event/modules/event-general/event-general.module';
/* Local Dependencies */
import {NavPrimaryComponent} from '@client/modules/nav/components/nav-primary/nav-primary.component';
import {NavPrimaryHeaderComponent} from './components/nav-primary-header/nav-primary-header.component';
import {NavPrimaryFooterComponent} from './components/nav-primary-footer/nav-primary-footer.component';
import {NavPrimaryItemsComponent} from './components/nav-primary-items/nav-primary-items.component';
import {NavPrimaryItemComponent} from './components/nav-primary-item/nav-primary-item.component';
import {NavPrimaryToolComponent} from './components/nav-primary-tool/nav-primary-tool.component';
import {NavSecondaryComponent} from './components/nav-secondary/nav-secondary.component';
import {NavSecondaryItemComponent} from './components/nav-secondary-item/nav-secondary-item.component';
import {NavSecondaryMoreComponent} from './components/nav-secondary-more/nav-secondary-more.component';
import {NavTertiaryComponent} from './components/nav-tertiary/nav-tertiary.component';
import {NavTertiaryItemComponent} from './components/nav-tertiary-item/nav-tertiary-item.component';
import {NavMobileComponent} from './components/nav-mobile/nav-mobile.component';

@NgModule({
	declarations: [
		NavPrimaryComponent,
		NavPrimaryHeaderComponent,
		NavPrimaryFooterComponent,
		NavPrimaryItemsComponent,
		NavPrimaryItemComponent,
		NavPrimaryToolComponent,
		NavSecondaryComponent,
		NavSecondaryItemComponent,
		NavSecondaryMoreComponent,
		NavTertiaryComponent,
		NavTertiaryItemComponent,
		NavMobileComponent,
	],
	imports: [
		CommonModule,
		MatIconModule,
		MatRippleModule,
		MatButtonModule,
		MatMenuModule,
		DragDropModule,
		OrcGraphicModule,
		OrcBitcoinGeneralModule,
		OrcEventGeneralModule,
	],
	exports: [
		NavPrimaryComponent,
		NavSecondaryComponent,
		NavSecondaryItemComponent,
		NavSecondaryMoreComponent,
		NavTertiaryComponent,
		NavMobileComponent,
	],
})
export class OrcNavModule {}
