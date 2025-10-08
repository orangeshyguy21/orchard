/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintSubsectionDashboardConnectionDialogComponent} from './mint-subsection-dashboard-connection-dialog.component';

describe('MintSubsectionDashboardConnectionDialogComponent', () => {
	let component: MintSubsectionDashboardConnectionDialogComponent;
	let fixture: ComponentFixture<MintSubsectionDashboardConnectionDialogComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionDashboardConnectionDialogComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionDashboardConnectionDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
