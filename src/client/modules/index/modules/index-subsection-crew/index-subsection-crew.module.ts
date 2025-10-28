/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule as CoreCommonModule} from '@angular/common';
import {RouterModule as CoreRouterModule} from '@angular/router';
import {ReactiveFormsModule as CoreReactiveFormsModule} from '@angular/forms';
/* Vendor Dependencies */
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
/* Application Dependencies */
import {OrcFormModule} from '@client/modules/form/form.module';
import {OrcLocalModule} from '@client/modules/local/local.module';
/* Local Dependencies */
import {IndexSubsectionCrewComponent} from './components/index-subsection-crew/index-subsection-crew.component';
import {IndexSubsectionCrewControlComponent} from './components/index-subsection-crew-control/index-subsection-crew-control.component';
import {IndexSubsectionCrewFormInviteComponent} from './components/index-subsection-crew-form-invite/index-subsection-crew-form-invite.component';
import {IndexSubsectionCrewTableComponent} from './components/index-subsection-crew-table/index-subsection-crew-table.component';
import {IndexSubsectionCrewInviteCodeComponent} from './components/index-subsection-crew-invite-code/index-subsection-crew-invite-code.component';

@NgModule({
	declarations: [
		IndexSubsectionCrewComponent,
		IndexSubsectionCrewControlComponent,
		IndexSubsectionCrewFormInviteComponent,
		IndexSubsectionCrewTableComponent,
		IndexSubsectionCrewInviteCodeComponent,
	],
	imports: [
		[
			CoreRouterModule.forChild([
				{
					path: '',
					component: IndexSubsectionCrewComponent,
				},
			]),
		],
		CoreCommonModule,
		CoreReactiveFormsModule,
		MatButtonModule,
		MatIconModule,
		MatFormFieldModule,
		MatInputModule,
		MatCardModule,
		MatSelectModule,
		MatDatepickerModule,
		MatAutocompleteModule,
		MatCheckboxModule,
		MatTableModule,
		MatSortModule,
		OrcFormModule,
		OrcLocalModule,
	],
})
export class OrcIndexSubsectionCrewModule {}
