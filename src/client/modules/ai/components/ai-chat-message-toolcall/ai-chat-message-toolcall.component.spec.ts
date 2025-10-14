/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Vendor Dependencies */
import {MatIconTestingModule} from '@angular/material/icon/testing';
/* Native Dependencies */
import {OrcAiModule} from '@client/modules/ai/ai.module';
/* Local Dependencies */
import {AiChatMessageToolcallComponent} from './ai-chat-message-toolcall.component';

describe('AiChatMessageToolcallComponent', () => {
	let component: AiChatMessageToolcallComponent;
	let fixture: ComponentFixture<AiChatMessageToolcallComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MatIconTestingModule, OrcAiModule],
			declarations: [AiChatMessageToolcallComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(AiChatMessageToolcallComponent);
		component = fixture.componentInstance;
		component.tool_call = {function: {name: 'test_tool', arguments: {foo: 'bar'}}} as any;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
