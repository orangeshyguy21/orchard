/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcEventGeneralModule} from '@client/modules/event/modules/event-general/event-general.module';
/* Local Dependencies */
import {EventGeneralNavToolComponent} from './event-general-nav-tool.component';

describe('EventGeneralNavToolComponent', () => {
	let component: EventGeneralNavToolComponent;
	let fixture: ComponentFixture<EventGeneralNavToolComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcEventGeneralModule],
		}).compileComponents();

		fixture = TestBed.createComponent(EventGeneralNavToolComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
