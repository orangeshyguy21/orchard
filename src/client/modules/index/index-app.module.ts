/* Core Dependencies */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
/* Vendor Dependencies */
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
/* Application Dependencies */
import { LocalModule } from '@client/modules/local/local.module';
import { GraphicModule } from '@client/modules/graphic/graphic.module';
import { ErrorModule } from '@client/modules/error/error.module';
import { BitcoinModule } from '@client/modules/bitcoin/bitcoin.module';
import { LightningModule } from '@client/modules/lightning/lightning.module';
import { MintModule } from '@client/modules/mint/mint.module';
/* Local Dependencies */
import { IndexSectionComponent } from './components/index-section/index-section.component';
import { IndexEnabledBitcoinComponent } from './components/index-enabled-bitcoin/index-enabled-bitcoin.component';
import { IndexEnabledLightningComponent } from './components/index-enabled-lightning/index-enabled-lightning.component';
import { IndexEnabledMintComponent } from './components/index-enabled-mint/index-enabled-mint.component';
import { IndexEnabledEcashComponent } from './components/index-enabled-ecash/index-enabled-ecash.component';
import { IndexDisabledMintComponent } from './components/index-disabled-mint/index-disabled-mint.component';
import { IndexDisabledEcashComponent } from './components/index-disabled-ecash/index-disabled-ecash.component';
import { IndexDisabledLightningComponent } from './components/index-disabled-lightning/index-disabled-lightning.component';
import { IndexDisabledBitcoinComponent } from './components/index-disabled-bitcoin/index-disabled-bitcoin.component';

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
		IndexEnabledBitcoinComponent,
		IndexEnabledLightningComponent,
		IndexEnabledMintComponent,
		IndexEnabledEcashComponent,
		IndexDisabledBitcoinComponent,
		IndexDisabledLightningComponent,
		IndexDisabledMintComponent,
		IndexDisabledEcashComponent,
	],
	imports: [
		CommonModule,
		MatCardModule,
		MatIconModule,
		MatRippleModule,
		MatButtonModule,
		LocalModule,
		GraphicModule,
		ErrorModule,
		BitcoinModule,
		LightningModule,
		MintModule,
		IndexAppRoutingModule,
	],
})
export class IndexAppModule { }