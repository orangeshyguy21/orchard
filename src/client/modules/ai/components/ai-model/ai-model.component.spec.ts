/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcAiModule} from '@client/modules/ai/ai.module';
/* Application Dependencies */
import {AiModel} from '@client/modules/ai/classes/ai-model.class';
/* Local Dependencies */
import {AiModelComponent} from './ai-model.component';

describe('AiModelComponent', () => {
	let component: AiModelComponent;
	let fixture: ComponentFixture<AiModelComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcAiModule],
		}).compileComponents();

		fixture = TestBed.createComponent(AiModelComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('model', 'model-a');
		fixture.componentRef.setInput('model_options', [
			new AiModel({
				model: 'model-a',
				name: 'Model A',
				context_length: 4096,
				ollama: {
					parameter_size: '1B',
					modified_at: Date.now(),
					size: 0,
					digest: 'x',
					parent_model: '',
					format: '',
					family: 'llama',
					families: ['llama'],
					quantization_level: 'Q4_0',
				} as any,
			}),
			new AiModel({
				model: 'model-b',
				name: 'Model B',
				context_length: 4096,
				ollama: {
					parameter_size: '2B',
					modified_at: Date.now(),
					size: 0,
					digest: 'y',
					parent_model: '',
					format: '',
					family: 'llama',
					families: ['llama'],
					quantization_level: 'Q4_0',
				} as any,
			}),
		]);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
