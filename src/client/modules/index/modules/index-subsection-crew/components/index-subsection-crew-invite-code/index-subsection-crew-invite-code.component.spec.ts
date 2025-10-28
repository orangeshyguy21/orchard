import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IndexSubsectionCrewInviteCodeComponent} from './index-subsection-crew-invite-code.component';

describe('IndexSubsectionCrewInviteCodeComponent', () => {
	let component: IndexSubsectionCrewInviteCodeComponent;
	let fixture: ComponentFixture<IndexSubsectionCrewInviteCodeComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [IndexSubsectionCrewInviteCodeComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionCrewInviteCodeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
