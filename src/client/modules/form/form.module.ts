/* Core Dependencies */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/* Vendor Dependencies */
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
/* Native Dependencies */
import { AutoGrowDirective } from '@client/modules/form/directives/auto-grow.directive';
import { DynamicFormFieldComponent } from './components/dynamic-form-field/dynamic-form-field.component';
import { AddFormArrayItemComponent } from './components/add-form-array-item/add-form-array-item.component';
import { HelpTextComponent } from './components/help-text/help-text.component';

@NgModule({
	declarations: [
		AutoGrowDirective,
  		DynamicFormFieldComponent,
    	AddFormArrayItemComponent,
     	HelpTextComponent,
	],
	imports: [
		CommonModule,
		MatFormFieldModule,
		MatButtonModule,
		MatIconModule,
	],
	exports: [
		AutoGrowDirective,
		DynamicFormFieldComponent,
		AddFormArrayItemComponent,
		HelpTextComponent,
	]
})
export class FormModule { }