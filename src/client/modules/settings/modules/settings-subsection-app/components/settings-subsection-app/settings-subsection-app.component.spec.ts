/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcSettingsSubsectionAppModule} from '@client/modules/settings/modules/settings-subsection-app/settings-subsection-app.module';
/* Local Dependencies */
import {SettingsSubsectionAppComponent} from './settings-subsection-app.component';

describe('SettingsSubsectionAppComponent', () => {
	let component: SettingsSubsectionAppComponent;
	let fixture: ComponentFixture<SettingsSubsectionAppComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcSettingsSubsectionAppModule],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionAppComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
