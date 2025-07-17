import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AiAgentDefinitionToolComponent} from './ai-agent-definition-tool.component';

describe('AiAgentDefinitionToolComponent', () => {
	let component: AiAgentDefinitionToolComponent;
	let fixture: ComponentFixture<AiAgentDefinitionToolComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AiAgentDefinitionToolComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(AiAgentDefinitionToolComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
