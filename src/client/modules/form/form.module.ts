/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
/* Vendor Dependencies */
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
/* Native Dependencies */
import {AutogrowDirective} from '@client/modules/form/directives/autogrow/autogrow.directive';
import {InputFormatDirective} from './directives/input-format/input-format.directive';
import {DynamicFormFieldComponent} from './components/dynamic-form-field/dynamic-form-field.component';
import {AddFormArrayItemComponent} from './components/add-form-array-item/add-form-array-item.component';
import {HelpTextComponent} from './components/help-text/help-text.component';

@NgModule({
	declarations: [AutogrowDirective, InputFormatDirective, DynamicFormFieldComponent, AddFormArrayItemComponent, HelpTextComponent],
	imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatButtonModule, MatIconModule],
	exports: [AutogrowDirective, InputFormatDirective, DynamicFormFieldComponent, AddFormArrayItemComponent, HelpTextComponent],
})
export class OrcFormModule {}
