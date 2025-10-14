/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcMintSubsectionConfigModule} from '@client/modules/mint/modules/mint-subsection-config/mint-subsection-config.module';
import {MintMintQuote} from '@client/modules/mint/classes/mint-mint-quote.class';
/* Local Dependencies */
import {MintSubsectionConfigChartQuoteTtlComponent} from './mint-subsection-config-chart-quote-ttl.component';

describe('MintSubsectionConfigChartQuoteTtlComponent', () => {
	let component: MintSubsectionConfigChartQuoteTtlComponent;
	let fixture: ComponentFixture<MintSubsectionConfigChartQuoteTtlComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionConfigModule],
			declarations: [MintSubsectionConfigChartQuoteTtlComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionConfigChartQuoteTtlComponent);
		component = fixture.componentInstance;
		component.nut = 'nut4';
		component.quotes = [
			new MintMintQuote({id: '1', amount_issued: 1, state: 'ISSUED', created_time: 1, issued_time: 2, unit: 'sat'} as any),
		];
		component.loading = false;
		component.locale = 'en-US';
		component.quote_ttl = 10;
		component.form_hot = false;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
