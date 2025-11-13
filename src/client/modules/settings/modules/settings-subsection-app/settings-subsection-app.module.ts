/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule as CoreCommonModule} from '@angular/common';
import {RouterModule as CoreRouterModule} from '@angular/router';
import {ReactiveFormsModule as CoreReactiveFormsModule} from '@angular/forms';
/* Vendor Dependencies */
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatCardModule} from '@angular/material/card';
/* Application Dependencies */
import {pendingEventGuard} from '@client/modules/event/guards/pending-event.guard';
/* Native Module Dependencies */
import {IndexSubsectionAppComponent} from './components/index-subsection-app/index-subsection-app.component';
import {IndexSubsectionAppBitcoinComponent} from './components/index-subsection-app-bitcoin/index-subsection-app-bitcoin.component';

@NgModule({
	declarations: [IndexSubsectionAppComponent, IndexSubsectionAppBitcoinComponent],
	imports: [
		[
			CoreRouterModule.forChild([
				{
					path: '',
					component: IndexSubsectionAppComponent,
					canDeactivate: [pendingEventGuard],
				},
			]),
		],
		CoreCommonModule,
		CoreReactiveFormsModule,
		MatCardModule,
		MatSlideToggleModule,
	],
})
export class OrcSettingsSubsectionAppModule {}
