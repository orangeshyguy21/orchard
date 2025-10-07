/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
/* Vendor Dependencies */
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatRippleModule} from '@angular/material/core';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
/* Application Dependencies */
import {OrcLocalModule} from '@client/modules/local/local.module';
import {OrcGraphicModule} from '@client/modules/graphic/graphic.module';
import {OrcErrorModule} from '@client/modules/error/error.module';
import {BitcoinModule} from '@client/modules/bitcoin/bitcoin.module';
import {LightningModule} from '@client/modules/lightning/lightning.module';
import {OrcNavModule} from '@client/modules/nav/nav.module';
import {OrcMintGeneralModule} from '@client/modules/mint/modules/mint-general/mint-general.module';
/* Local Dependencies */
import {IndexSectionComponent} from './components/index-section/index-section.component';
import {IndexBitcoinHeaderComponent} from './components/index-bitcoin-header/index-bitcoin-header.component';
import {IndexBitcoinEnabledComponent} from './components/index-bitcoin-enabled/index-bitcoin-enabled.component';
import {IndexBitcoinDisabledComponent} from './components/index-bitcoin-disabled/index-bitcoin-disabled.component';
import {IndexBitcoinInfoComponent} from './components/index-bitcoin-info/index-bitcoin-info.component';
import {IndexLightningHeaderComponent} from './components/index-lightning-header/index-lightning-header.component';
import {IndexLightningEnabledComponent} from './components/index-lightning-enabled/index-lightning-enabled.component';
import {IndexLightningDisabledComponent} from './components/index-lightning-disabled/index-lightning-disabled.component';
import {IndexMintHeaderComponent} from './components/index-mint-header/index-mint-header.component';
import {IndexMintEnabledComponent} from './components/index-mint-enabled/index-mint-enabled.component';
import {IndexMintDisabledComponent} from './components/index-mint-disabled/index-mint-disabled.component';
import {IndexEcashHeaderComponent} from './components/index-ecash-header/index-ecash-header.component';
import {IndexEcashEnabledComponent} from './components/index-ecash-enabled/index-ecash-enabled.component';
import {IndexEcashDisabledComponent} from './components/index-ecash-disabled/index-ecash-disabled.component';
import {IndexBitcoinHotwalletComponent} from './components/index-bitcoin-hotwallet/index-bitcoin-hotwallet.component';
import {IndexBitcoinSyncingComponent} from './components/index-bitcoin-syncing/index-bitcoin-syncing.component';
import {IndexBitcoinBlockchainComponent} from './components/index-bitcoin-blockchain/index-bitcoin-blockchain.component';
import {IndexLightningInfoComponent} from './components/index-lightning-info/index-lightning-info.component';
import {IndexMintInfoComponent} from './components/index-mint-info/index-mint-info.component';

const routes: Routes = [
	{
		path: '',
		component: IndexSectionComponent,
		title: 'Orchard',
		data: {
			section: 'index',
		},
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
	declarations: [],
})
export class IndexAppRoutingModule {}

@NgModule({
	declarations: [
		IndexSectionComponent,
		IndexBitcoinHeaderComponent,
		IndexBitcoinEnabledComponent,
		IndexBitcoinDisabledComponent,
		IndexBitcoinInfoComponent,
		IndexBitcoinHotwalletComponent,
		IndexBitcoinSyncingComponent,
		IndexBitcoinBlockchainComponent,
		IndexLightningHeaderComponent,
		IndexLightningEnabledComponent,
		IndexLightningDisabledComponent,
		IndexLightningInfoComponent,
		IndexMintHeaderComponent,
		IndexMintEnabledComponent,
		IndexMintDisabledComponent,
		IndexMintInfoComponent,
		IndexEcashHeaderComponent,
		IndexEcashEnabledComponent,
		IndexEcashDisabledComponent,
	],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatCardModule,
		MatIconModule,
		MatRippleModule,
		MatButtonModule,
		MatTableModule,
		MatProgressSpinnerModule,
		MatFormFieldModule,
		MatSelectModule,
		OrcLocalModule,
		OrcGraphicModule,
		OrcErrorModule,
		BitcoinModule,
		LightningModule,
		OrcNavModule,
		OrcMintGeneralModule,
		IndexAppRoutingModule,
	],
})
export class IndexAppModule {}
