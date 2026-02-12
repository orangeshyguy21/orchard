/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcChartModule} from '@client/modules/chart/chart.module';
/* Local Dependencies */
import {ChartGraphicBarsComponent} from './chart-graphic-bars.component';

describe('ChartGraphicBarsComponent', () => {
	let component: ChartGraphicBarsComponent;
	let fixture: ComponentFixture<ChartGraphicBarsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcChartModule],
		}).compileComponents();

		fixture = TestBed.createComponent(ChartGraphicBarsComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('bars', []);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
