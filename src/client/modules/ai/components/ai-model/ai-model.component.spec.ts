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
				modified_at: Date.now(),
				name: 'Model A',
				size: 0,
				digest: 'x',
				details: {parameter_size: '1B'} as any,
			} as any),
			new AiModel({
				model: 'model-b',
				modified_at: Date.now(),
				name: 'Model B',
				size: 0,
				digest: 'y',
				details: {parameter_size: '2B'} as any,
			} as any),
		]);
		fixture.componentRef.setInput('device_mobile', false);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
