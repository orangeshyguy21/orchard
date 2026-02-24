/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Vendor Dependencies */
import {MatIconTestingModule} from '@angular/material/icon/testing';
/* Native Dependencies */
import {OrcEventSubsectionLogModule} from '@client/modules/event/modules/event-subsection-log/event-subsection-log.module';
/* Shared Dependencies */
import {EventLogType, EventLogStatus} from '@shared/generated.types';
/* Local Dependencies */
import {EventSubsectionLogEventIconComponent} from './event-subsection-log-event-icon.component';

describe('EventSubsectionLogEventIconComponent', () => {
    let component: EventSubsectionLogEventIconComponent;
    let fixture: ComponentFixture<EventSubsectionLogEventIconComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [OrcEventSubsectionLogModule, MatIconTestingModule],
        }).compileComponents();

        fixture = TestBed.createComponent(EventSubsectionLogEventIconComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('type', EventLogType.Update);
        fixture.componentRef.setInput('status', EventLogStatus.Success);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
