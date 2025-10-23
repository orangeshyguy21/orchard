/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcAuthSectionModule} from '@client/modules/auth/modules/auth-section/auth-section.module';
/* Local Dependencies */
import {AuthSectionComponent} from './auth-section.component';

describe('AuthSectionComponent', () => {
	let component: AuthSectionComponent;
	let fixture: ComponentFixture<AuthSectionComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AuthSectionComponent],
			imports: [OrcAuthSectionModule],
		}).compileComponents();

		fixture = TestBed.createComponent(AuthSectionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
