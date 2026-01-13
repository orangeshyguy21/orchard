/* Core Dependencies */
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
/* Vendor Dependencies */
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
/* Application Dependencies */
import {OrcNavModule} from '@client/modules/nav/nav.module';
import {OrcAiModule} from '@client/modules/ai/ai.module';
import {OrcEventGeneralModule} from '@client/modules/event/modules/event-general/event-general.module';
/* Native Dependencies */
import {LayoutExteriorComponent} from './components/layout-exterior/layout-exterior.component';
import {LayoutInteriorComponent} from './components/layout-interior/layout-interior.component';

@NgModule({
	imports: [RouterModule, MatSidenavModule, MatProgressSpinnerModule, OrcNavModule, OrcAiModule, OrcEventGeneralModule],
	declarations: [LayoutExteriorComponent, LayoutInteriorComponent],
})
export class OrcLayoutModule {}
