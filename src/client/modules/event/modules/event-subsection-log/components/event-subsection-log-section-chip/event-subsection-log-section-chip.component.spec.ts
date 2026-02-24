/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcEventSubsectionLogModule} from '@client/modules/event/modules/event-subsection-log/event-subsection-log.module';
/* Shared Dependencies */
import {EventLogSection} from '@shared/generated.types';
/* Local Dependencies */
import {EventSubsectionLogSectionChipComponent} from './event-subsection-log-section-chip.component';

describe('EventSubsectionLogSectionChipComponent', () => {
    let component: EventSubsectionLogSectionChipComponent;
    let fixture: ComponentFixture<EventSubsectionLogSectionChipComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [OrcEventSubsectionLogModule],
        }).compileComponents();

        fixture = TestBed.createComponent(EventSubsectionLogSectionChipComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('section', EventLogSection.Settings);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
