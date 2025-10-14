/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcAiModule} from '@client/modules/ai/ai.module';
/* Local Dependencies */
import {AiAgentComponent} from './ai-agent.component';

describe('AiAgentComponent', () => {
	let component: AiAgentComponent;
	let fixture: ComponentFixture<AiAgentComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcAiModule],
			declarations: [AiAgentComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(AiAgentComponent);
		component = fixture.componentInstance;
		component.agent = {name: 'Agent', icon: 'smart_toy', section: 'ai'} as any;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
