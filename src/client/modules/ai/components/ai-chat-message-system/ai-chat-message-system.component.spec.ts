import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcAiModule} from '@client/modules/ai/ai.module';
/* Local Dependencies */
import {AiChatMessageSystemComponent} from './ai-chat-message-system.component';

describe('AiChatMessageSystemComponent', () => {
	let component: AiChatMessageSystemComponent;
	let fixture: ComponentFixture<AiChatMessageSystemComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcAiModule],
			declarations: [AiChatMessageSystemComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(AiChatMessageSystemComponent);
		component = fixture.componentInstance;
		component.message = {role: 'system', content: 'Test system message'} as any;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
