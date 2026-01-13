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
		fixture.componentRef.setInput('nut', 'nut4');
		fixture.componentRef.setInput('quotes', [
			new MintMintQuote({id: '1', amount_issued: 1, state: 'ISSUED', created_time: 1, unit: 'sat'} as any),
		]);
		fixture.componentRef.setInput('loading', false);
		fixture.componentRef.setInput('locale', 'en-US');
		fixture.componentRef.setInput('unit', 'sat');
		fixture.componentRef.setInput('method', 'bolt11');
		fixture.componentRef.setInput('min_amount', 0);
		fixture.componentRef.setInput('max_amount', 10);
		fixture.componentRef.setInput('min_hot', false);
		fixture.componentRef.setInput('max_hot', false);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
