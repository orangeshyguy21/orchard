/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormControl} from '@angular/forms';
/* Native Dependencies */
import {OrcAiModule} from '@client/modules/ai/ai.module';
/* Shared Dependencies */
import {AiAgent} from '@shared/generated.types';
/* Local Dependencies */
import {AiNavComponent} from './ai-nav.component';

describe('AiNavComponent', () => {
	let component: AiNavComponent;
	let fixture: ComponentFixture<AiNavComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcAiModule],
			declarations: [AiNavComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(AiNavComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('active_agent', AiAgent.Default);
		fixture.componentRef.setInput('active_chat', false);
		fixture.componentRef.setInput('model', null);
		fixture.componentRef.setInput('model_options', []);
		fixture.componentRef.setInput('actionable', false);
		fixture.componentRef.setInput('content', new FormControl(''));
		fixture.componentRef.setInput('conversation', null);
		fixture.componentRef.setInput('tool_length', 0);
		fixture.componentRef.setInput('log_open', false);
		fixture.componentRef.setInput('mobile_agent', false);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
