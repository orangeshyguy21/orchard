/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
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
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
