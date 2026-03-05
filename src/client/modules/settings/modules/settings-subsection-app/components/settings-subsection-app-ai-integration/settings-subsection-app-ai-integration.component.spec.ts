import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SettingsSubsectionAppAiIntegrationComponent} from './settings-subsection-app-ai-integration.component';

describe('SettingsSubsectionAppAiIntegrationComponent', () => {
	let component: SettingsSubsectionAppAiIntegrationComponent;
	let fixture: ComponentFixture<SettingsSubsectionAppAiIntegrationComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SettingsSubsectionAppAiIntegrationComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionAppAiIntegrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
