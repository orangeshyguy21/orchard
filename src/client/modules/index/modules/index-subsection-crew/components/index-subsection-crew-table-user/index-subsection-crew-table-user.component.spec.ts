import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IndexSubsectionCrewTableUserComponent} from './index-subsection-crew-table-user.component';

describe('IndexSubsectionCrewTableUserComponent', () => {
	let component: IndexSubsectionCrewTableUserComponent;
	let fixture: ComponentFixture<IndexSubsectionCrewTableUserComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [IndexSubsectionCrewTableUserComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionCrewTableUserComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
