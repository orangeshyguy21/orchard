import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AuthSubsectionSignupComponent} from './auth-subsection-signup.component';

describe('AuthSubsectionSignupComponent', () => {
	let component: AuthSubsectionSignupComponent;
	let fixture: ComponentFixture<AuthSubsectionSignupComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AuthSubsectionSignupComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(AuthSubsectionSignupComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
