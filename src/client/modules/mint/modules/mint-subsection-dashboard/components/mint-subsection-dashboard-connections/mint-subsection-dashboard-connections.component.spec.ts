/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintSubsectionDashboardConnectionsComponent} from './mint-subsection-dashboard-connections.component';

describe('MintSubsectionDashboardConnectionsComponent', () => {
	let component: MintSubsectionDashboardConnectionsComponent;
	let fixture: ComponentFixture<MintSubsectionDashboardConnectionsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionDashboardConnectionsComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionDashboardConnectionsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
