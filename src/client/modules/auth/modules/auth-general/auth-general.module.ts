/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule as CoreCommonModule} from '@angular/common';
import {ReactiveFormsModule as CoreReactiveFormsModule} from '@angular/forms';
/* Vendor Dependencies */
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
/* Application Dependencies */
import {OrcFormModule} from '@client/modules/form/form.module';
/* Local Dependencies */
import {AuthGeneralFormcontrolPasswordComponent} from './components/auth-general-formcontrol-password/auth-general-formcontrol-password.component';
import {AuthGeneralFormcontrolNameComponent} from './components/auth-general-formcontrol-name/auth-general-formcontrol-name.component';

@NgModule({
	declarations: [AuthGeneralFormcontrolPasswordComponent, AuthGeneralFormcontrolNameComponent],
	imports: [CoreCommonModule, CoreReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, OrcFormModule],
	exports: [AuthGeneralFormcontrolPasswordComponent, AuthGeneralFormcontrolNameComponent],
})
export class OrcAuthGeneralModule {}
