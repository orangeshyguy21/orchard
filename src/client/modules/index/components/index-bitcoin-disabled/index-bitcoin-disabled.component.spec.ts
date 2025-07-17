import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IndexBitcoinDisabledComponent} from './index-bitcoin-disabled.component';

describe('IndexBitcoinDisabledComponent', () => {
	let component: IndexBitcoinDisabledComponent;
	let fixture: ComponentFixture<IndexBitcoinDisabledComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [IndexBitcoinDisabledComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexBitcoinDisabledComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
