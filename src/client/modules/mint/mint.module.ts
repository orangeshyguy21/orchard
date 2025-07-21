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
import {MintIconComponent} from './components/mint-icon/mint-icon.component';
import {MintKeysetComponent} from './components/mint-keyset/mint-keyset.component';
import {MintBalanceSheetComponent} from './components/mint-balance-sheet/mint-balance-sheet.component';

@NgModule({
	declarations: [MintIconComponent, MintKeysetComponent, MintBalanceSheetComponent],
	imports: [CommonModule, MatIconModule, MatCardModule, MatTableModule, MatButtonModule, GraphicModule, LocalModule, ErrorModule],
	exports: [MintIconComponent, MintKeysetComponent, MintBalanceSheetComponent],
})
export class MintModule {}
