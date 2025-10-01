/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {SettingsAppModule} from '@client/modules/settings/settings.app.module';
/* Local Dependencies */
import {SettingsCategoriesComponent} from './settings-categories.component';

describe('SettingsCategoriesComponent', () => {
	let component: SettingsCategoriesComponent;
	let fixture: ComponentFixture<SettingsCategoriesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [SettingsAppModule],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsCategoriesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
