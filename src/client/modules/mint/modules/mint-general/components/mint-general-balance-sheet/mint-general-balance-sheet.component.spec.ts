import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MintGeneralBalanceSheetComponent} from './mint-general-balance-sheet.component';

describe('MintGeneralBalanceSheetComponent', () => {
	let component: MintGeneralBalanceSheetComponent;
	let fixture: ComponentFixture<MintGeneralBalanceSheetComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintGeneralBalanceSheetComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintGeneralBalanceSheetComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
