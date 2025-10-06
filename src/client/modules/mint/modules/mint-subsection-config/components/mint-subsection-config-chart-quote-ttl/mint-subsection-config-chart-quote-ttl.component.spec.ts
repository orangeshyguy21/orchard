/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintSubsectionConfigChartQuoteTtlComponent} from './mint-subsection-config-chart-quote-ttl.component';

describe('MintSubsectionConfigChartQuoteTtlComponent', () => {
	let component: MintSubsectionConfigChartQuoteTtlComponent;
	let fixture: ComponentFixture<MintSubsectionConfigChartQuoteTtlComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionConfigChartQuoteTtlComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionConfigChartQuoteTtlComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
