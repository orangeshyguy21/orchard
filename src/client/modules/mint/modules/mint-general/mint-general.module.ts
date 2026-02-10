/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
/* Vendor Dependencies */
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatRippleModule} from '@angular/material/core';
import {MatChipsModule} from '@angular/material/chips';
/* Application Dependencies */
import {OrcGraphicModule} from '@client/modules/graphic/graphic.module';
import {OrcLocalModule} from '@client/modules/local/local.module';
import {OrcErrorModule} from '@client/modules/error/error.module';
import {OrcTimeModule} from '@client/modules/time/time.module';
/* Local Dependencies */
import {MintGeneralIconComponent} from './components/mint-general-icon/mint-general-icon.component';
import {MintGeneralNameComponent} from './components/mint-general-name/mint-general-name.component';
import {MintGeneralKeysetComponent} from './components/mint-general-keyset/mint-general-keyset.component';
import {MintGeneralBalanceSheetComponent} from './components/mint-general-balance-sheet/mint-general-balance-sheet.component';
import {MintGeneralInfoComponent} from './components/mint-general-info/mint-general-info.component';

@NgModule({
	declarations: [
		MintGeneralIconComponent,
		MintGeneralNameComponent,
		MintGeneralKeysetComponent,
		MintGeneralBalanceSheetComponent,
		MintGeneralInfoComponent,
	],
	imports: [
		CommonModule,
		MatIconModule,
		MatCardModule,
		MatTableModule,
		MatButtonModule,
		MatRippleModule,
		MatChipsModule,
		OrcGraphicModule,
		OrcLocalModule,
		OrcErrorModule,
		OrcTimeModule,
	],
	exports: [
		MintGeneralIconComponent,
		MintGeneralNameComponent,
		MintGeneralKeysetComponent,
		MintGeneralBalanceSheetComponent,
		MintGeneralInfoComponent,
	],
})
export class OrcMintGeneralModule {}
