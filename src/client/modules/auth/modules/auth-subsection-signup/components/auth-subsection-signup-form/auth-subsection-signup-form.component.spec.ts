/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormGroup, FormControl} from '@angular/forms';
/* Native Dependencies */
import {OrcAuthSubsectionSignupModule} from '@client/modules/auth/modules/auth-subsection-signup/auth-subsection-signup.module';
/* Local Dependencies */
import {AuthSubsectionSignupFormComponent} from './auth-subsection-signup-form.component';

describe('AuthSubsectionSignupFormComponent', () => {
	let component: AuthSubsectionSignupFormComponent;
	let fixture: ComponentFixture<AuthSubsectionSignupFormComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcAuthSubsectionSignupModule],
		}).compileComponents();

		fixture = TestBed.createComponent(AuthSubsectionSignupFormComponent);
		component = fixture.componentInstance;

		// Set required inputs
		fixture.componentRef.setInput(
			'form_group',
			new FormGroup({
				key: new FormControl(''),
				name: new FormControl(''),
				password: new FormControl(''),
				password_confirm: new FormControl(''),
			}),
		);
		fixture.componentRef.setInput('errors', {
			key: null,
			name: null,
			password: null,
			password_confirm: null,
		});

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
