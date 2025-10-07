/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintSubsectionDatabaseChartLegendComponent} from './mint-subsection-database-chart-legend.component';

describe('MintSubsectionDatabaseChartLegendComponent', () => {
	let component: MintSubsectionDatabaseChartLegendComponent;
	let fixture: ComponentFixture<MintSubsectionDatabaseChartLegendComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionDatabaseChartLegendComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionDatabaseChartLegendComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
