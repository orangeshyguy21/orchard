/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormControl, FormGroup, Validators} from '@angular/forms';
/* Native Dependtions */
import {OrcAuthSubsectionInitializationModule} from '@client/modules/auth/modules/auth-subsection-initialization/auth-subsection-initialization.module';
/* Local Dependencies */
import {AuthSubsectionInitializationFormComponent} from './auth-subsection-initialization-form.component';

describe('AuthSubsectionInitializationFormComponent', () => {
	let component: AuthSubsectionInitializationFormComponent;
	let fixture: ComponentFixture<AuthSubsectionInitializationFormComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcAuthSubsectionInitializationModule],
		}).compileComponents();

		fixture = TestBed.createComponent(AuthSubsectionInitializationFormComponent);
		component = fixture.componentInstance;

		const form_group = new FormGroup({
			key: new FormControl('', {validators: [Validators.required]}),
			name: new FormControl('', {validators: [Validators.required]}),
			password: new FormControl('', {validators: [Validators.required]}),
			password_confirm: new FormControl('', {validators: [Validators.required]}),
		});
		const errors = {key: null, name: null, password: null, password_confirm: null};

		fixture.componentRef.setInput('form_group', form_group);
		fixture.componentRef.setInput('errors', errors);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
