/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcEventSubsectionLogModule} from '@client/modules/event/modules/event-subsection-log/event-subsection-log.module';
/* Local Dependencies */
import {EventSubsectionLogChartComponent} from './event-subsection-log-chart.component';

describe('EventSubsectionLogChartComponent', () => {
    let component: EventSubsectionLogChartComponent;
    let fixture: ComponentFixture<EventSubsectionLogChartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [OrcEventSubsectionLogModule],
        }).compileComponents();

        fixture = TestBed.createComponent(EventSubsectionLogChartComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('events', []);
        fixture.componentRef.setInput('date_start', 1700000000);
        fixture.componentRef.setInput('date_end', 1700086400);
        fixture.componentRef.setInput('locale', 'en-US');
        fixture.componentRef.setInput('loading', false);
        fixture.componentRef.setInput('page_index', 0);
        fixture.componentRef.setInput('page_size', 100);
        fixture.componentRef.setInput('count', 0);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
