/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcGraphicModule} from '@client/modules/graphic/graphic.module';
/* Local Dependencies */
import {GraphicOracleComponent} from './graphic-oracle.component';

describe('GraphicOracleComponent', () => {
	let component: GraphicOracleComponent;
	let fixture: ComponentFixture<GraphicOracleComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcGraphicModule],
		}).compileComponents();

		fixture = TestBed.createComponent(GraphicOracleComponent);
		component = fixture.componentInstance;

		// set all required inputs using modern signal-based input API
		fixture.componentRef.setInput('height', '400px');
		fixture.componentRef.setInput('running', false);
		fixture.componentRef.setInput('status', null);

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
