/* Core Dependencies */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/* Native Module Dependencies */
import { AutoGrowDirective } from '@client/modules/form/directives/auto-grow.directive';

@NgModule({
	declarations: [
		AutoGrowDirective,
	],
	imports: [
		CommonModule,
	],
	exports: [
		AutoGrowDirective,
	]
})
export class FormModule { }