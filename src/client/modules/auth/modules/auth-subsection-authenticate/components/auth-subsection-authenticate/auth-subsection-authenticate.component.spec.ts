/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideRouter} from '@angular/router';
/* Vendor Dependencies */
import {provideLuxonDateAdapter} from '@angular/material-luxon-adapter';
/* Native Dependencies */
import {OrcAuthSubsectionAuthenticateModule} from '@client/modules/auth/modules/auth-subsection-authenticate/auth-subsection-authenticate.module';
/* Local Dependencies */
import {AuthSubsectionAuthenticateComponent} from './auth-subsection-authenticate.component';

describe('AuthSubsectionAuthenticateComponent', () => {
	let component: AuthSubsectionAuthenticateComponent;
	let fixture: ComponentFixture<AuthSubsectionAuthenticateComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcAuthSubsectionAuthenticateModule],
			providers: [provideLuxonDateAdapter(), provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
		}).compileComponents();

		fixture = TestBed.createComponent(AuthSubsectionAuthenticateComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
