/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule as CoreCommonModule} from '@angular/common';
/* Vendor Dependencies */
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
/* Native Module Dependencies */
import {PublicExitWarningComponent} from './components/public-exit-warning/public-exit-warning.component';

@NgModule({
	declarations: [PublicExitWarningComponent],
	imports: [CoreCommonModule, MatDialogModule, MatButtonModule, MatIconModule],
	exports: [],
})
export class OrcPublicModule {}
