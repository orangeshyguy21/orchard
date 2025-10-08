/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {SettingsGeneralEnvComponent} from './settings-general-env.component';

describe('SettingsGeneralEnvComponent', () => {
	let component: SettingsGeneralEnvComponent;
	let fixture: ComponentFixture<SettingsGeneralEnvComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SettingsGeneralEnvComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsGeneralEnvComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
