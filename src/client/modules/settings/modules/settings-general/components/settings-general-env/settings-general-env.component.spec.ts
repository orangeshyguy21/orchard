/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcSettingsGeneralModule} from '@client/modules/settings/modules/settings-general/settings-general.module';
/* Local Dependencies */
import {SettingsGeneralEnvComponent} from './settings-general-env.component';

describe('SettingsGeneralEnvComponent', () => {
	let component: SettingsGeneralEnvComponent;
	let fixture: ComponentFixture<SettingsGeneralEnvComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcSettingsGeneralModule],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsGeneralEnvComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
