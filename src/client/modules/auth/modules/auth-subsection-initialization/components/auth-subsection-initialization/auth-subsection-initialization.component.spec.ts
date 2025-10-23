/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcAuthSubsectionInitializationModule} from '@client/modules/auth/modules/auth-subsection-initialization/auth-subsection-initialization.module';
/* Local Dependencies */
import {AuthSubsectionInitializationComponent} from './auth-subsection-initialization.component';

describe('AuthSubsectionInitializationComponent', () => {
	let component: AuthSubsectionInitializationComponent;
	let fixture: ComponentFixture<AuthSubsectionInitializationComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcAuthSubsectionInitializationModule],
		}).compileComponents();

		fixture = TestBed.createComponent(AuthSubsectionInitializationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
