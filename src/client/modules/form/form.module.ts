/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
/* Vendor Dependencies */
import {ScrollingModule} from '@angular/cdk/scrolling';
import {OverlayModule} from '@angular/cdk/overlay';
import {PortalModule} from '@angular/cdk/portal';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatRippleModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatListModule} from '@angular/material/list';
/* Native Dependencies */
import {FormAutogrowDirective} from '@client/modules/form/directives/form-autogrow/form-autogrow.directive';
import {FormNumberSeparatorDirective} from './directives/form-number-separator/form-number-separator.directive';
import {FormFieldDynamicComponent} from './components/form-field-dynamic/form-field-dynamic.component';
import {FormArrayAddItemComponent} from './components/form-array-add-item/form-array-add-item.component';
import {FormHelpTextComponent} from './components/form-help-text/form-help-text.component';
import {FormFilterMenuComponent} from './components/form-filter-menu/form-filter-menu.component';
import {FormErrorComponent} from './components/form-error/form-error.component';
import {FormToggleComponent} from './components/form-toggle/form-toggle.component';
import {FormScrollCalendarComponent} from './components/form-scroll-calendar/form-scroll-calendar.component';
import {FormDaterangeScrollPickerComponent} from './components/form-daterange-scroll-picker/form-daterange-scroll-picker.component';

@NgModule({
	declarations: [
		FormAutogrowDirective,
		FormNumberSeparatorDirective,
		FormFieldDynamicComponent,
		FormArrayAddItemComponent,
		FormHelpTextComponent,
		FormFilterMenuComponent,
		FormErrorComponent,
		FormToggleComponent,
		FormScrollCalendarComponent,
		FormDaterangeScrollPickerComponent,
	],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		ScrollingModule,
		OverlayModule,
		PortalModule,
		MatFormFieldModule,
		MatButtonModule,
		MatIconModule,
		MatRippleModule,
		MatDatepickerModule,
		MatListModule,
	],
	exports: [
		FormAutogrowDirective,
		FormNumberSeparatorDirective,
		FormFieldDynamicComponent,
		FormArrayAddItemComponent,
		FormHelpTextComponent,
		FormFilterMenuComponent,
		FormErrorComponent,
		FormToggleComponent,
		FormScrollCalendarComponent,
		FormDaterangeScrollPickerComponent,
	],
})
export class OrcFormModule {}
