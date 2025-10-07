/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintSubsectionDatabaseChartComponent} from './mint-subsection-database-chart.component';

describe('MintSubsectionDatabaseChartComponent', () => {
	let component: MintSubsectionDatabaseChartComponent;
	let fixture: ComponentFixture<MintSubsectionDatabaseChartComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionDatabaseChartComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionDatabaseChartComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
