/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcMintSubsectionConfigModule} from '@client/modules/mint/modules/mint-subsection-config/mint-subsection-config.module';
import {MintMintQuote} from '@client/modules/mint/classes/mint-mint-quote.class';
/* Local Dependencies */
import {MintSubsectionConfigChartMethodComponent} from './mint-subsection-config-chart-method.component';

describe('MintSubsectionConfigChartMethodComponent', () => {
	let component: MintSubsectionConfigChartMethodComponent;
	let fixture: ComponentFixture<MintSubsectionConfigChartMethodComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionConfigModule],
			declarations: [MintSubsectionConfigChartMethodComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionConfigChartMethodComponent);
		component = fixture.componentInstance;
		component.nut = 'nut4';
		component.quotes = [new MintMintQuote({id: '1', amount_issued: 1, state: 'ISSUED', created_time: 1, unit: 'sat'} as any)];
		component.loading = false;
		component.locale = 'en-US';
		component.unit = 'sat';
		component.method = 'bolt11';
		component.min_amount = 0;
		component.max_amount = 10;
		component.min_hot = false;
		component.max_hot = false;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
