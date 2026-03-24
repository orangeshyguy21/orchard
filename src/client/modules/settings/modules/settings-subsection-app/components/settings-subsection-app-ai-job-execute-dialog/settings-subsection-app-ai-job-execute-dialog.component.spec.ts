/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
/* Vendor Dependencies */
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {of} from 'rxjs';
/* Application Dependencies */
import {AiService} from '@client/modules/ai/services/ai/ai.service';
import {OrcSettingsSubsectionAppModule} from '@client/modules/settings/modules/settings-subsection-app/settings-subsection-app.module';
/* Local Dependencies */
import {SettingsSubsectionAppAiJobExecuteDialogComponent} from './settings-subsection-app-ai-job-execute-dialog.component';

describe('SettingsSubsectionAppAiJobExecuteDialogComponent', () => {
	let component: SettingsSubsectionAppAiJobExecuteDialogComponent;
	let fixture: ComponentFixture<SettingsSubsectionAppAiJobExecuteDialogComponent>;

	beforeEach(async () => {
		const ai_service_mock = {
			executeAiAgent: jasmine.createSpy('executeAiAgent').and.returnValue(
				of({
					id: '1',
					status: 'SUCCESS',
					result: '# Test Result',
					error: null,
					tokens_used: 100,
					started_at: 1000,
					completed_at: 2000,
					schedule_trigger: null,
					notified: false,
				}),
			),
		};

		await TestBed.configureTestingModule({
			imports: [OrcSettingsSubsectionAppModule, HttpClientTestingModule],
			declarations: [SettingsSubsectionAppAiJobExecuteDialogComponent],
			providers: [
				{provide: MatDialogRef, useValue: {close: jasmine.createSpy('close')}},
				{provide: MAT_DIALOG_DATA, useValue: {id: '1', name: 'Test Agent'}},
				{provide: AiService, useValue: ai_service_mock},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionAppAiJobExecuteDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
