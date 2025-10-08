/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {AuthSubsectionAuthenticatePasswordComponent} from './auth-subsection-authenticate-password.component';

describe('AuthSubsectionAuthenticatePasswordComponent', () => {
	let component: AuthSubsectionAuthenticatePasswordComponent;
	let fixture: ComponentFixture<AuthSubsectionAuthenticatePasswordComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AuthSubsectionAuthenticatePasswordComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(AuthSubsectionAuthenticatePasswordComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
