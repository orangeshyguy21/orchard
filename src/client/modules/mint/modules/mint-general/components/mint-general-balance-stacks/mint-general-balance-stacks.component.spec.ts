import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MintGeneralBalanceStacksComponent} from './mint-general-balance-stacks.component';

describe('MintGeneralBalanceStacksComponent', () => {
	let component: MintGeneralBalanceStacksComponent;
	let fixture: ComponentFixture<MintGeneralBalanceStacksComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintGeneralBalanceStacksComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintGeneralBalanceStacksComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
