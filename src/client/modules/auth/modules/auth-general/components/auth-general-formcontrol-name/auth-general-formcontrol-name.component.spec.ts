/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormControl, FormGroup, Validators} from '@angular/forms';
/* Native Dependencies */
import {OrcAuthGeneralModule} from '@client/modules/auth/modules/auth-general/auth-general.module';
/* Local Dependencies */
import {AuthGeneralFormcontrolNameComponent} from './auth-general-formcontrol-name.component';

describe('AuthGeneralFormcontrolNameComponent', () => {
	let component: AuthGeneralFormcontrolNameComponent;
	let fixture: ComponentFixture<AuthGeneralFormcontrolNameComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcAuthGeneralModule],
		}).compileComponents();

		fixture = TestBed.createComponent(AuthGeneralFormcontrolNameComponent);
		component = fixture.componentInstance;

		const form_group = new FormGroup({
			name: new FormControl('', {validators: [Validators.required]}),
		});

		fixture.componentRef.setInput('form_group', form_group);
		fixture.componentRef.setInput('control_name', 'name');
		fixture.componentRef.setInput('label', 'Username');
		fixture.componentRef.setInput('focused_control', false);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
