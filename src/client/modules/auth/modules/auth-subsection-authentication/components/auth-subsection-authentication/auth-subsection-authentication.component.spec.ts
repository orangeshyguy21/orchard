/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcAuthSubsectionAuthenticationModule} from '@client/modules/auth/modules/auth-subsection-authentication/auth-subsection-authentication.module';
/* Local Dependencies */
import {AuthSubsectionAuthenticationComponent} from './auth-subsection-authentication.component';

describe('AuthSubsectionAuthenticationComponent', () => {
	let component: AuthSubsectionAuthenticationComponent;
	let fixture: ComponentFixture<AuthSubsectionAuthenticationComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcAuthSubsectionAuthenticationModule],
		}).compileComponents();

		fixture = TestBed.createComponent(AuthSubsectionAuthenticationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
