/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule as CoreCommonModule} from '@angular/common';
import {ReactiveFormsModule as CoreReactiveFormsModule} from '@angular/forms';
/* Vendor Dependencies */
import {MatDialogModule} from '@angular/material/dialog';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSliderModule} from '@angular/material/slider';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
/* Application Dependencies */
import {OrcButtonModule} from '@client/modules/button/button.module';
/* Native Dependencies */
import {NetworkConnectionComponent} from './components/network-connection/network-connection.component';
import {NetworkConnectionStatusComponent} from './components/network-connection-status/network-connection-status.component';

@NgModule({
	imports: [
		CoreCommonModule,
		CoreReactiveFormsModule,
		MatDialogModule,
		MatSlideToggleModule,
		MatFormFieldModule,
		MatSliderModule,
		MatIconModule,
		MatButtonModule,
		OrcButtonModule,
	],
	declarations: [NetworkConnectionComponent, NetworkConnectionStatusComponent],
	exports: [NetworkConnectionStatusComponent],
})
export class OrcNetworkModule {}
