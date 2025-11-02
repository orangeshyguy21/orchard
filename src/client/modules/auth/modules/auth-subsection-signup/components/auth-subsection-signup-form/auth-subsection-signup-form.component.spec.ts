import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AuthSubsectionSignupFormComponent} from './auth-subsection-signup-form.component';

describe('AuthSubsectionSignupFormComponent', () => {
	let component: AuthSubsectionSignupFormComponent;
	let fixture: ComponentFixture<AuthSubsectionSignupFormComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AuthSubsectionSignupFormComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(AuthSubsectionSignupFormComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
