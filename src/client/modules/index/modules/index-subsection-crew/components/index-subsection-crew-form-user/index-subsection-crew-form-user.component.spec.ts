import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IndexSubsectionCrewFormUserComponent} from './index-subsection-crew-form-user.component';

describe('IndexSubsectionCrewFormUserComponent', () => {
	let component: IndexSubsectionCrewFormUserComponent;
	let fixture: ComponentFixture<IndexSubsectionCrewFormUserComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [IndexSubsectionCrewFormUserComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionCrewFormUserComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
