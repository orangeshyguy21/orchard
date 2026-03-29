import {ComponentFixture, TestBed} from '@angular/core/testing';
import {SettingsSubsectionAppAiToolChipsComponent} from './settings-subsection-app-ai-tool-chips.component';

describe('SettingsSubsectionAppAiToolChipsComponent', () => {
	let component: SettingsSubsectionAppAiToolChipsComponent;
	let fixture: ComponentFixture<SettingsSubsectionAppAiToolChipsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SettingsSubsectionAppAiToolChipsComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionAppAiToolChipsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
