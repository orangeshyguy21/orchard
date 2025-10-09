/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
/* Vendor Dependencies */
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
/* Native Dependencies */
import {FormAutogrowDirective} from '@client/modules/form/directives/form-autogrow/form-autogrow.directive';
import {InputFormatDirective} from './directives/input-format/input-format.directive';
import {FormFieldDynamicComponent} from './components/form-field-dynamic/form-field-dynamic.component';
import {FormArrayAddItemComponent} from './components/form-array-add-item/form-array-add-item.component';
import {FormHelpTextComponent} from './components/form-help-text/form-help-text.component';

@NgModule({
	declarations: [
		FormAutogrowDirective,
		InputFormatDirective,
		FormFieldDynamicComponent,
		FormArrayAddItemComponent,
		FormHelpTextComponent,
	],
	imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatButtonModule, MatIconModule],
	exports: [FormAutogrowDirective, InputFormatDirective, FormFieldDynamicComponent, FormArrayAddItemComponent, FormHelpTextComponent],
})
export class OrcFormModule {}
