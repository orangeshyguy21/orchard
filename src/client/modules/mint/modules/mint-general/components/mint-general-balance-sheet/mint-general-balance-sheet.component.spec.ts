/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcMintGeneralModule} from '@client/modules/mint/modules/mint-general/mint-general.module';
/* Local Dependencies */
import {MintGeneralBalanceSheetComponent} from './mint-general-balance-sheet.component';

describe('MintGeneralBalanceSheetComponent', () => {
	let component: MintGeneralBalanceSheetComponent;
	let fixture: ComponentFixture<MintGeneralBalanceSheetComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintGeneralModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintGeneralBalanceSheetComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('balances', []);
		fixture.componentRef.setInput('keysets', []);
		fixture.componentRef.setInput('lightning_balance', null);
		fixture.componentRef.setInput('lightning_enabled', false);
		fixture.componentRef.setInput('lightning_loading', false);
		fixture.componentRef.setInput('loading', true);
		fixture.componentRef.setInput('device_desktop', true);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
