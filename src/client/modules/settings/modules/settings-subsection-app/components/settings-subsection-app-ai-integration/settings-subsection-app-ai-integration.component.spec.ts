/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormGroup, FormControl} from '@angular/forms';
/* Native Dependencies */
import {OrcSettingsSubsectionAppModule} from '@client/modules/settings/modules/settings-subsection-app/settings-subsection-app.module';
/* Local Dependencies */
import {SettingsSubsectionAppAiIntegrationComponent} from './settings-subsection-app-ai-integration.component';

describe('SettingsSubsectionAppAiIntegrationComponent', () => {
	let component: SettingsSubsectionAppAiIntegrationComponent;
	let fixture: ComponentFixture<SettingsSubsectionAppAiIntegrationComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcSettingsSubsectionAppModule],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionAppAiIntegrationComponent);
		component = fixture.componentInstance;

		const mock_form_group = new FormGroup({
			ollama_api: new FormControl(''),
			openrouter_key: new FormControl(''),
		});

		fixture.componentRef.setInput('ai_enabled', false);
		fixture.componentRef.setInput('ai_health', null);
		fixture.componentRef.setInput('form_group', mock_form_group);
		fixture.componentRef.setInput('selected_vendor', '');
		fixture.componentRef.setInput('device_type', 'desktop');

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
