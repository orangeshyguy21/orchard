/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule as CoreCommonModule} from '@angular/common';
import {RouterModule as CoreRouterModule} from '@angular/router';
import {ReactiveFormsModule as CoreReactiveFormsModule} from '@angular/forms';
import {IndexSubsectionCrewComponent} from './components/index-subsection-crew/index-subsection-crew.component';
/* Vendor Dependencies */

/* Application Dependencies */
import {OrcNavModule} from '@client/modules/nav/nav.module';
/* Local Dependencies */

@NgModule({
	declarations: [IndexSubsectionCrewComponent],
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
		OrcNavModule,
	],
})
export class OrcIndexSubsectionCrewModule {}
