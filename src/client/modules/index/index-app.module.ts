/* Core Dependencies */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
/* Vendor Dependencies */
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
/* Application Dependencies */
import { LocalModule } from '@client/modules/local/local.module';
import { GraphicModule } from '@client/modules/graphic/graphic.module';
import { ErrorModule } from '@client/modules/error/error.module';
import { BitcoinModule } from '@client/modules/bitcoin/bitcoin.module';
import { LightningModule } from '@client/modules/lightning/lightning.module';
import { NavModule } from '@client/modules/nav/nav.module';
import { MintModule } from '@client/modules/mint/mint.module';
/* Local Dependencies */
import { IndexSectionComponent } from './components/index-section/index-section.component';
import { IndexBitcoinHeaderComponent } from './components/index-bitcoin-header/index-bitcoin-header.component';
import { IndexBitcoinEnabledComponent } from './components/index-bitcoin-enabled/index-bitcoin-enabled.component';
import { IndexBitcoinDisabledComponent } from './components/index-bitcoin-disabled/index-bitcoin-disabled.component';
import { IndexLightningHeaderComponent } from './components/index-lightning-header/index-lightning-header.component';
import { IndexLightningEnabledComponent } from './components/index-lightning-enabled/index-lightning-enabled.component';
import { IndexLightningDisabledComponent } from './components/index-lightning-disabled/index-lightning-disabled.component';
import { IndexMintHeaderComponent } from './components/index-mint-header/index-mint-header.component';
import { IndexMintEnabledComponent } from './components/index-mint-enabled/index-mint-enabled.component';
import { IndexMintDisabledComponent } from './components/index-mint-disabled/index-mint-disabled.component';
import { IndexEcashHeaderComponent } from './components/index-ecash-header/index-ecash-header.component';
import { IndexEcashEnabledComponent } from './components/index-ecash-enabled/index-ecash-enabled.component';
import { IndexEcashDisabledComponent } from './components/index-ecash-disabled/index-ecash-disabled.component';

const routes: Routes = [
	{
		path: '',
		component: IndexSectionComponent,
		title: 'Orchard',
		data: {
			section: 'index',
		}
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(routes),
	],
	exports: [
		RouterModule,
	],
	declarations: [],
})
export class IndexAppRoutingModule { }


@NgModule({
	declarations: [
		IndexSectionComponent,
		IndexBitcoinHeaderComponent,
		IndexBitcoinEnabledComponent,
		IndexBitcoinDisabledComponent,
		IndexLightningHeaderComponent,
		IndexLightningEnabledComponent,
		IndexLightningDisabledComponent,
		IndexMintHeaderComponent,
		IndexMintEnabledComponent,
		IndexMintDisabledComponent,
		IndexEcashHeaderComponent,
		IndexEcashEnabledComponent,
		IndexEcashDisabledComponent,
	],
	imports: [
		CommonModule,
		MatCardModule,
		MatIconModule,
		MatRippleModule,
		MatButtonModule,
		MatTableModule,
		MatProgressSpinnerModule,
		LocalModule,
		GraphicModule,
		ErrorModule,
		BitcoinModule,
		LightningModule,
		NavModule,
		MintModule,
		IndexAppRoutingModule,
	],
})
export class IndexAppModule { }