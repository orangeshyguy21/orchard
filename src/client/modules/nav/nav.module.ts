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
import {GraphicModule} from '@client/modules/graphic/graphic.module';
import {BitcoinModule} from '@client/modules/bitcoin/bitcoin.module';
import {EventModule} from '@client/modules/event/event.module';
/* Local Dependencies */
import {PrimaryNavComponent} from '@client/modules/nav/components/primary-nav/primary-nav.component';
import {PrimaryNavHeaderComponent} from './components/primary-nav-header/primary-nav-header.component';
import {PrimaryNavItemsComponent} from './components/primary-nav-items/primary-nav-items.component';
import {PrimaryNavItemComponent} from './components/primary-nav-item/primary-nav-item.component';
import {SecondaryNavComponent} from './components/secondary-nav/secondary-nav.component';
import {SecondaryNavItemComponent} from './components/secondary-nav-item/secondary-nav-item.component';
import {PrimaryNavFooterComponent} from './components/primary-nav-footer/primary-nav-footer.component';
import {PrimaryNavToolComponent} from './components/primary-nav-tool/primary-nav-tool.component';
import {SecondaryNavMoreComponent} from './components/secondary-nav-more/secondary-nav-more.component';
import {TertiaryNavComponent} from './components/tertiary-nav/tertiary-nav.component';
import {TertiaryNavItemComponent} from './components/tertiary-nav-item/tertiary-nav-item.component';

@NgModule({
	declarations: [
		PrimaryNavComponent,
		PrimaryNavHeaderComponent,
		PrimaryNavItemsComponent,
		PrimaryNavItemComponent,
		SecondaryNavComponent,
		SecondaryNavItemComponent,
		PrimaryNavFooterComponent,
		PrimaryNavToolComponent,
		SecondaryNavMoreComponent,
		TertiaryNavComponent,
		TertiaryNavItemComponent,
	],
	imports: [
		CommonModule,
		MatIconModule,
		MatRippleModule,
		MatButtonModule,
		MatMenuModule,
		DragDropModule,
		GraphicModule,
		BitcoinModule,
		EventModule,
	],
	exports: [PrimaryNavComponent, SecondaryNavComponent, SecondaryNavItemComponent, SecondaryNavMoreComponent, TertiaryNavComponent],
})
export class NavModule {}
