// /* Core Dependencies */
// import {ComponentFixture, TestBed} from '@angular/core/testing';
// /* Material Testing */
// import {MatIconTestingModule} from '@angular/material/icon/testing';
// /* Local Dependencies */
// import {AiAgentDefinitionToolComponent} from './ai-agent-definition-tool.component';

// describe('AiAgentDefinitionToolComponent', () => {
// 	let component: AiAgentDefinitionToolComponent;
// 	let fixture: ComponentFixture<AiAgentDefinitionToolComponent>;

// 	beforeEach(async () => {
// 		await TestBed.configureTestingModule({
// 			declarations: [AiAgentDefinitionToolComponent],
// 			imports: [MatIconTestingModule],
// 		}).compileComponents();

// 		fixture = TestBed.createComponent(AiAgentDefinitionToolComponent);
// 		component = fixture.componentInstance;
// 		fixture.detectChanges();
// 	});

// 	it('should create', () => {
// 		expect(component).toBeTruthy();
// 	});
// });

/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Material */
import {MatIconModule} from '@angular/material/icon';
/* Local Dependencies */
import {AiAgentDefinitionToolComponent} from './ai-agent-definition-tool.component';

describe('AiAgentDefinitionToolComponent', () => {
	let component: AiAgentDefinitionToolComponent;
	let fixture: ComponentFixture<AiAgentDefinitionToolComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AiAgentDefinitionToolComponent],
			imports: [MatIconModule],
		});
		TestBed.overrideComponent(AiAgentDefinitionToolComponent, {set: {animations: []}});
		await TestBed.compileComponents();

		fixture = TestBed.createComponent(AiAgentDefinitionToolComponent);
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
