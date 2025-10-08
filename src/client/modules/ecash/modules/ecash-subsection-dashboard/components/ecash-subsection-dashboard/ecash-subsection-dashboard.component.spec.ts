import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EcashSubsectionDashboardComponent} from './ecash-subsection-dashboard.component';

describe('EcashSubsectionDashboardComponent', () => {
	let component: EcashSubsectionDashboardComponent;
	let fixture: ComponentFixture<EcashSubsectionDashboardComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [EcashSubsectionDashboardComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(EcashSubsectionDashboardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
