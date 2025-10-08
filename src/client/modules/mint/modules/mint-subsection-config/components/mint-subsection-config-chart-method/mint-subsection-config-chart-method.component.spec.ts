/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintSubsectionConfigChartMethodComponent} from './mint-subsection-config-chart-method.component';

describe('MintSubsectionConfigChartMethodComponent', () => {
	let component: MintSubsectionConfigChartMethodComponent;
	let fixture: ComponentFixture<MintSubsectionConfigChartMethodComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionConfigChartMethodComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionConfigChartMethodComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
