import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IndexSubsectionCrewDialogUserComponent} from './index-subsection-crew-dialog-user.component';

describe('IndexSubsectionCrewDialogUserComponent', () => {
	let component: IndexSubsectionCrewDialogUserComponent;
	let fixture: ComponentFixture<IndexSubsectionCrewDialogUserComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [IndexSubsectionCrewDialogUserComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionCrewDialogUserComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
