import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IndexSubsectionCrewFormInviteComponent} from './index-subsection-crew-form-invite.component';

describe('IndexSubsectionCrewFormInviteComponent', () => {
	let component: IndexSubsectionCrewFormInviteComponent;
	let fixture: ComponentFixture<IndexSubsectionCrewFormInviteComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [IndexSubsectionCrewFormInviteComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionCrewFormInviteComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
