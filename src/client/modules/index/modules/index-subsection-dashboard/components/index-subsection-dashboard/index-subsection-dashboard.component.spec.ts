/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {IndexSubsectionDashboardComponent} from './index-subsection-dashboard.component';

describe('IndexSubsectionDashboardComponent', () => {
	let component: IndexSubsectionDashboardComponent;
	let fixture: ComponentFixture<IndexSubsectionDashboardComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [IndexSubsectionDashboardComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionDashboardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
