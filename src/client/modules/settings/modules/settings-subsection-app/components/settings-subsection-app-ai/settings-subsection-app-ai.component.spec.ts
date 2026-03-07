/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormGroup, FormControl} from '@angular/forms';
/* Native Dependencies */
import {OrcSettingsSubsectionAppModule} from '@client/modules/settings/modules/settings-subsection-app/settings-subsection-app.module';
/* Local Dependencies */
import {SettingsSubsectionAppAiComponent} from './settings-subsection-app-ai.component';

describe('SettingsSubsectionAppAiComponent', () => {
	let component: SettingsSubsectionAppAiComponent;
	let fixture: ComponentFixture<SettingsSubsectionAppAiComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcSettingsSubsectionAppModule],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionAppAiComponent);
		component = fixture.componentInstance;

		fixture.componentRef.setInput('ai_enabled', false);
		const mock_form_group = new FormGroup({
			ollama_api: new FormControl(''),
			openrouter_key: new FormControl(''),
		});

		fixture.componentRef.setInput('form_group', mock_form_group);
		fixture.componentRef.setInput('device_type', 'desktop');

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
