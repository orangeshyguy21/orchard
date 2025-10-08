/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {AuthSubsectionAuthenticateComponent} from './auth-subsection-authenticate.component';

describe('AuthSubsectionAuthenticateComponent', () => {
	let component: AuthSubsectionAuthenticateComponent;
	let fixture: ComponentFixture<AuthSubsectionAuthenticateComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AuthSubsectionAuthenticateComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(AuthSubsectionAuthenticateComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
