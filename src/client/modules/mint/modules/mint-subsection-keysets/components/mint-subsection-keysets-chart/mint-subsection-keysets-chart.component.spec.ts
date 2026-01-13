/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcMintSubsectionKeysetsModule} from '@client/modules/mint/modules/mint-subsection-keysets/mint-subsection-keysets.module';
/* Local Dependencies */
import {MintSubsectionKeysetsChartComponent} from './mint-subsection-keysets-chart.component';

describe('MintSubsectionKeysetsChartComponent', () => {
	let component: MintSubsectionKeysetsChartComponent;
	let fixture: ComponentFixture<MintSubsectionKeysetsChartComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionKeysetsModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionKeysetsChartComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('loading', true);
		fixture.componentRef.setInput('locale', 'en-US');
		fixture.componentRef.setInput('interval', 'day');
		fixture.componentRef.setInput('keysets', []);
		fixture.componentRef.setInput('keysets_analytics', []);
		fixture.componentRef.setInput('keysets_analytics_pre', []);
		fixture.componentRef.setInput('mint_genesis_time', 0);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
