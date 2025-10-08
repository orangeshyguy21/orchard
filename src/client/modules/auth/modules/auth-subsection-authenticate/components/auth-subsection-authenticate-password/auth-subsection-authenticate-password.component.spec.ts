/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormControl, FormGroup, Validators} from '@angular/forms';
/* Native Dependencies */
import {OrcAuthSubsectionAuthenticateModule} from '@client/modules/auth/modules/auth-subsection-authenticate/auth-subsection-authenticate.module';
/* Local Dependencies */
import {AuthSubsectionAuthenticatePasswordComponent} from './auth-subsection-authenticate-password.component';

describe('AuthSubsectionAuthenticatePasswordComponent', () => {
	let component: AuthSubsectionAuthenticatePasswordComponent;
	let fixture: ComponentFixture<AuthSubsectionAuthenticatePasswordComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcAuthSubsectionAuthenticateModule],
		}).compileComponents();

		fixture = TestBed.createComponent(AuthSubsectionAuthenticatePasswordComponent);
		component = fixture.componentInstance;
		component.form_group = new FormGroup({password: new FormControl('', {validators: [Validators.required]})});
		component.control_name = 'password';
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
