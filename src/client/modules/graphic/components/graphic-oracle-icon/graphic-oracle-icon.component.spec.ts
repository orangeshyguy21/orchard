/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcGraphicModule} from '@client/modules/graphic/graphic.module';
/* Local Dependencies */
import {GraphicOracleIconComponent} from './graphic-oracle-icon.component';

describe('GraphicOracleIconComponent', () => {
	let component: GraphicOracleIconComponent;
	let fixture: ComponentFixture<GraphicOracleIconComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcGraphicModule],
		}).compileComponents();

		fixture = TestBed.createComponent(GraphicOracleIconComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
