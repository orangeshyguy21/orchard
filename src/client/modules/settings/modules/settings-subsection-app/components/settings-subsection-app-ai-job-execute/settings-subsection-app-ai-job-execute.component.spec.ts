import {ComponentFixture, TestBed} from '@angular/core/testing';
import {SettingsSubsectionAppAiJobExecuteComponent} from './settings-subsection-app-ai-job-execute.component';
import {FormPanelRef} from '@client/modules/form/services/form-panel/form-panel-ref';
import {FORM_PANEL_DATA} from '@client/modules/form/services/form-panel/form-panel.types';
import {AiService} from '@client/modules/ai/services/ai/ai.service';
import {NEVER} from 'rxjs';
import {NO_ERRORS_SCHEMA} from '@angular/core';

describe('SettingsSubsectionAppAiJobExecuteComponent', () => {
	let component: SettingsSubsectionAppAiJobExecuteComponent;
	let fixture: ComponentFixture<SettingsSubsectionAppAiJobExecuteComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SettingsSubsectionAppAiJobExecuteComponent],
			providers: [
				{provide: FORM_PANEL_DATA, useValue: {id: 'test-id', name: 'Test Agent'}},
				{provide: FormPanelRef, useValue: {close: jasmine.createSpy('close')}},
				{provide: AiService, useValue: {executeAiAgent: jasmine.createSpy('executeAiAgent').and.returnValue(NEVER)}},
			],
			schemas: [NO_ERRORS_SCHEMA],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionAppAiJobExecuteComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should format time correctly', () => {
		expect(component.formatTime(0)).toBe('00:00');
		expect(component.formatTime(65)).toBe('01:05');
		expect(component.formatTime(3600)).toBe('60:00');
	});
});
