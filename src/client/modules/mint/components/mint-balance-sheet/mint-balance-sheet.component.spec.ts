import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MintModule} from '@client/modules/mint/mint.module';
import {MintBalanceSheetComponent} from './mint-balance-sheet.component';

describe('MintBalanceSheetComponent', () => {
	let component: MintBalanceSheetComponent;
	let fixture: ComponentFixture<MintBalanceSheetComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MintModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintBalanceSheetComponent);
		component = fixture.componentInstance;
		component.balances = [] as any;
		component.keysets = [] as any;
		component.lightning_enabled = false as any;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
