/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcSettingsSubsectionUserModule} from '@client/modules/settings/modules/settings-subsection-user/settings-subsection-user.module';
/* Local Dependencies */
import {SettingsSubsectionUserComponent} from './settings-subsection-user.component';

describe('SettingsSubsectionUserComponent', () => {
	let component: SettingsSubsectionUserComponent;
	let fixture: ComponentFixture<SettingsSubsectionUserComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcSettingsSubsectionUserModule],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionUserComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
