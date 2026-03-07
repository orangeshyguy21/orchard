/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Material */
import {MatIconModule} from '@angular/material/icon';
/* Local Dependencies */
import {AiAssistantDefinitionToolComponent} from './ai-assistant-definition-tool.component';

describe('AiAssistantDefinitionToolComponent', () => {
	let component: AiAssistantDefinitionToolComponent;
	let fixture: ComponentFixture<AiAssistantDefinitionToolComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AiAssistantDefinitionToolComponent],
			imports: [MatIconModule],
		});
		TestBed.overrideComponent(AiAssistantDefinitionToolComponent, {set: {animations: []}});
		await TestBed.compileComponents();

		fixture = TestBed.createComponent(AiAssistantDefinitionToolComponent);
		component = fixture.componentInstance;
		const mock_tool = {
			function: {
				name: 'testTool',
				description: 'desc',
				parameters: {required: []},
			},
		} as any;
		fixture.componentRef.setInput('tool', mock_tool);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
