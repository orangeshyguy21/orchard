import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IndexSubsectionCrewTableInviteComponent} from './index-subsection-crew-table-invite.component';

describe('IndexSubsectionCrewTableInviteComponent', () => {
	let component: IndexSubsectionCrewTableInviteComponent;
	let fixture: ComponentFixture<IndexSubsectionCrewTableInviteComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [IndexSubsectionCrewTableInviteComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionCrewTableInviteComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
