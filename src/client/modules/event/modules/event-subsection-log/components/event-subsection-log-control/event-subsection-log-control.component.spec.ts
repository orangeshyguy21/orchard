/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Vendor Dependencies */
import {MatIconTestingModule} from '@angular/material/icon/testing';
/* Native Dependencies */
import {OrcEventSubsectionLogModule} from '@client/modules/event/modules/event-subsection-log/event-subsection-log.module';
/* Local Dependencies */
import {EventSubsectionLogControlComponent} from './event-subsection-log-control.component';

describe('EventSubsectionLogControlComponent', () => {
    let component: EventSubsectionLogControlComponent;
    let fixture: ComponentFixture<EventSubsectionLogControlComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [OrcEventSubsectionLogModule, MatIconTestingModule],
        }).compileComponents();

        fixture = TestBed.createComponent(EventSubsectionLogControlComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
