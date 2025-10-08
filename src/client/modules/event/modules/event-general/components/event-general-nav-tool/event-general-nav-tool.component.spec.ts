/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {EventGeneralNavToolComponent} from './event-general-nav-tool.component';

describe('EventGeneralNavToolComponent', () => {
	let component: EventGeneralNavToolComponent;
	let fixture: ComponentFixture<EventGeneralNavToolComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [EventGeneralNavToolComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(EventGeneralNavToolComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
