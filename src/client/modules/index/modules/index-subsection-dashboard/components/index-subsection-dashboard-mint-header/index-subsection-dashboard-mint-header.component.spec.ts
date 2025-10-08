import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IndexSubsectionDashboardMintHeaderComponent} from './index-subsection-dashboard-mint-header.component';

describe('IndexSubsectionDashboardMintHeaderComponent', () => {
	let component: IndexSubsectionDashboardMintHeaderComponent;
	let fixture: ComponentFixture<IndexSubsectionDashboardMintHeaderComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [IndexSubsectionDashboardMintHeaderComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionDashboardMintHeaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
