import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IndexSubsectionCrewDialogInviteComponent} from './index-subsection-crew-dialog-invite.component';

describe('IndexSubsectionCrewDialogInviteComponent', () => {
	let component: IndexSubsectionCrewDialogInviteComponent;
	let fixture: ComponentFixture<IndexSubsectionCrewDialogInviteComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [IndexSubsectionCrewDialogInviteComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionCrewDialogInviteComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
