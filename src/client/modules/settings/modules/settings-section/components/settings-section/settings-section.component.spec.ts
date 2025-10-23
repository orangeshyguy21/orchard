/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';
/* Native Dependencies */
import {OrcSettingsSectionModule} from '@client/modules/settings/modules/settings-section/settings-section.module';
/* Local Dependencies */
import {SettingsSectionComponent} from './settings-section.component';

describe('SettingsSectionComponent', () => {
	let component: SettingsSectionComponent;
	let fixture: ComponentFixture<SettingsSectionComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcSettingsSectionModule],
			providers: [provideRouter([])],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSectionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
