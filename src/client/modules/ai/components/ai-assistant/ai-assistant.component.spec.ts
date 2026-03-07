/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcAiModule} from '@client/modules/ai/ai.module';
/* Local Dependencies */
import {AiAssistantComponent} from './ai-assistant.component';

describe('AiAssistantComponent', () => {
	let component: AiAssistantComponent;
	let fixture: ComponentFixture<AiAssistantComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcAiModule],
			declarations: [AiAssistantComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(AiAssistantComponent);
		component = fixture.componentInstance;
		component.assistant = {name: 'Assistant', icon: 'smart_toy', section: 'ai'} as any;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
