import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AuthSubsectionInviteComponent} from './auth-subsection-invite.component';

describe('AuthSubsectionInviteComponent', () => {
	let component: AuthSubsectionInviteComponent;
	let fixture: ComponentFixture<AuthSubsectionInviteComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AuthSubsectionInviteComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(AuthSubsectionInviteComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
