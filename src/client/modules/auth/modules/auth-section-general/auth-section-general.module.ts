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
import {AuthSectionGeneralFormcontrolPasswordComponent} from './components/auth-section-general-formcontrol-password/auth-section-general-formcontrol-password.component';
import {AuthSectionGeneralFormcontrolNameComponent} from './components/auth-section-general-formcontrol-name/auth-section-general-formcontrol-name.component';

@NgModule({
	declarations: [AuthSectionGeneralFormcontrolPasswordComponent, AuthSectionGeneralFormcontrolNameComponent],
	imports: [CoreCommonModule, CoreReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, OrcFormModule],
	exports: [AuthSectionGeneralFormcontrolPasswordComponent, AuthSectionGeneralFormcontrolNameComponent],
})
export class OrcAuthSectionGeneralModule {}
