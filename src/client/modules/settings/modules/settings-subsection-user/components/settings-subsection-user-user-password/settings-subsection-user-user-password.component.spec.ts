/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcSettingsSubsectionUserModule} from '@client/modules/settings/modules/settings-subsection-user/settings-subsection-user.module';
/* Local Dependencies */
import {SettingsSubsectionUserUserPasswordComponent} from './settings-subsection-user-user-password.component';

describe('SettingsSubsectionUserUserPasswordComponent', () => {
	let component: SettingsSubsectionUserUserPasswordComponent;
	let fixture: ComponentFixture<SettingsSubsectionUserUserPasswordComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcSettingsSubsectionUserModule],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionUserUserPasswordComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
