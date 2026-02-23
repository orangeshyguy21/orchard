/* Core Dependencies */
import {NgModule} from '@angular/core';
import {RouterModule as CoreRouterModule} from '@angular/router';
import {CommonModule as CoreCommonModule} from '@angular/common';
import {ReactiveFormsModule as CoreReactiveFormsModule} from '@angular/forms';
/* Vendor Dependencies */
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
/* Application Dependencies */
import {OrcLocalModule} from '@client/modules/local/local.module';
import {OrcDataModule} from '@client/modules/data/data.module';
import {OrcFormModule} from '@client/modules/form/form.module';
import {OrcCrewModule} from '@client/modules/crew/crew.module';
import {OrcButtonModule} from '@client/modules/button/button.module';
/* Local Dependencies */
import {EventSubsectionLogComponent} from './components/event-subsection-log/event-subsection-log.component';
import {EventSubsectionLogControlComponent} from './components/event-subsection-log-control/event-subsection-log-control.component';
import {EventSubsectionLogTableComponent} from './components/event-subsection-log-table/event-subsection-log-table.component';
import {EventSubsectionLogTableDetailComponent} from './components/event-subsection-log-table-detail/event-subsection-log-table-detail.component';
import { EventSubsectionLogSectionChipComponent } from './components/event-subsection-log-section-chip/event-subsection-log-section-chip.component';
import { EventSubsectionLogEventIconComponent } from './components/event-subsection-log-event-icon/event-subsection-log-event-icon.component';
import {EventLogEventPipe} from './pipes/event-log-event/event-log-event.pipe';
import {EventLogDetailsPipe} from './pipes/event-log-details/event-log-details.pipe';

@NgModule({
    declarations: [
        EventSubsectionLogComponent,
        EventSubsectionLogControlComponent,
        EventSubsectionLogTableComponent,
        EventSubsectionLogTableDetailComponent,
        EventSubsectionLogSectionChipComponent,
        EventSubsectionLogEventIconComponent,
        EventLogEventPipe,
        EventLogDetailsPipe,
    ],
    imports: [
        CoreRouterModule.forChild([
            {
                path: '',
                component: EventSubsectionLogComponent,
            },
        ]),
        CoreCommonModule,
        CoreReactiveFormsModule,
        MatIconModule,
        MatMenuModule,
        MatTableModule,
        MatPaginatorModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        OrcLocalModule,
        OrcDataModule,
        OrcFormModule,
        OrcCrewModule,
        OrcButtonModule,
    ],
    exports: [],
})
export class OrcEventSubsectionLogModule {}
