/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintSubsectionDashboardConnectionStatusComponent} from './mint-subsection-dashboard-connection-status.component';

describe('MintSubsectionDashboardConnectionStatusComponent', () => {
	let component: MintSubsectionDashboardConnectionStatusComponent;
	let fixture: ComponentFixture<MintSubsectionDashboardConnectionStatusComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionDashboardConnectionStatusComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionDashboardConnectionStatusComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
