import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AuthSectionGeneralFormcontrolPasswordComponent} from './auth-section-general-formcontrol-password.component';

describe('AuthSectionGeneralFormcontrolPasswordComponent', () => {
	let component: AuthSectionGeneralFormcontrolPasswordComponent;
	let fixture: ComponentFixture<AuthSectionGeneralFormcontrolPasswordComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AuthSectionGeneralFormcontrolPasswordComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(AuthSectionGeneralFormcontrolPasswordComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
