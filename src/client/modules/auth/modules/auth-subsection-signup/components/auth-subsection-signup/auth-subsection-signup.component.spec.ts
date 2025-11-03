/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivatedRoute} from '@angular/router';
/* Vendor Dependencies */
import {of} from 'rxjs';
/* Native Dependencies */
import {OrcAuthSubsectionSignupModule} from '@client/modules/auth/modules/auth-subsection-signup/auth-subsection-signup.module';
/* Local Dependencies */
import {AuthSubsectionSignupComponent} from './auth-subsection-signup.component';

describe('AuthSubsectionSignupComponent', () => {
	let component: AuthSubsectionSignupComponent;
	let fixture: ComponentFixture<AuthSubsectionSignupComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcAuthSubsectionSignupModule],
			providers: [
				{
					provide: ActivatedRoute,
					useValue: {
						params: of({}),
						queryParams: of({}),
						snapshot: {params: {}, queryParams: {}},
					},
				},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(AuthSubsectionSignupComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
