import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AuthSubsectionInviteFormComponent} from './auth-subsection-invite-form.component';

describe('AuthSubsectionInviteFormComponent', () => {
	let component: AuthSubsectionInviteFormComponent;
	let fixture: ComponentFixture<AuthSubsectionInviteFormComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AuthSubsectionInviteFormComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(AuthSubsectionInviteFormComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
