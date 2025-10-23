/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormControl, FormGroup, Validators} from '@angular/forms';
/* Native Dependencies */
import {OrcAuthSubsectionAuthenticationModule} from '@client/modules/auth/modules/auth-subsection-authentication/auth-subsection-authentication.module';
/* Local Dependencies */
import {AuthSubsectionAuthenticationFormComponent} from './auth-subsection-authentication-form.component';

describe('AuthSubsectionAuthenticationFormComponent', () => {
	let component: AuthSubsectionAuthenticationFormComponent;
	let fixture: ComponentFixture<AuthSubsectionAuthenticationFormComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcAuthSubsectionAuthenticationModule],
		}).compileComponents();

		fixture = TestBed.createComponent(AuthSubsectionAuthenticationFormComponent);
		component = fixture.componentInstance;

		const form_group = new FormGroup({
			name: new FormControl('', {validators: [Validators.required]}),
			password: new FormControl('', {validators: [Validators.required]}),
		});
		const errors = {name: null, password: null};

		fixture.componentRef.setInput('form_group', form_group);
		fixture.componentRef.setInput('errors', errors);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
