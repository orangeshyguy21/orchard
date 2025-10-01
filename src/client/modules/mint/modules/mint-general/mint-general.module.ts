/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
/* Vendor Dependencies */
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
/* Application Dependencies */
import {GraphicModule} from '@client/modules/graphic/graphic.module';
import {LocalModule} from '@client/modules/local/local.module';
import {ErrorModule} from '@client/modules/error/error.module';
/* Local Dependencies */
import {MintGeneralIconComponent} from './mint-general-icon/mint-general-icon.component';
import {MintGeneralKeysetComponent} from './mint-general-keyset/mint-general-keyset.component';
import {MintGeneralBalanceSheetComponent} from './mint-general-balance-sheet/mint-general-balance-sheet.component';

@NgModule({
	declarations: [MintGeneralIconComponent, MintGeneralKeysetComponent, MintGeneralBalanceSheetComponent],
	imports: [CommonModule, MatIconModule, MatCardModule, MatTableModule, MatButtonModule, GraphicModule, LocalModule, ErrorModule],
	exports: [MintGeneralIconComponent, MintGeneralKeysetComponent, MintGeneralBalanceSheetComponent],
})
export class MintGeneralModule {}
