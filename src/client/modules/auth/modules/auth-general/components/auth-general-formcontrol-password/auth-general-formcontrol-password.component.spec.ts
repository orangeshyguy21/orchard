/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcAuthGeneralModule} from '@client/modules/auth/modules/auth-general/auth-general.module';
/* Local Dependencies */
import {AuthGeneralFormcontrolPasswordComponent} from './auth-general-formcontrol-password.component';

describe('AuthGeneralFormcontrolPasswordComponent', () => {
	let component: AuthGeneralFormcontrolPasswordComponent;
	let fixture: ComponentFixture<AuthGeneralFormcontrolPasswordComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcAuthGeneralModule],
		}).compileComponents();

		fixture = TestBed.createComponent(AuthGeneralFormcontrolPasswordComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
