import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IndexBitcoinEnabledComponent} from './index-bitcoin-enabled.component';

describe('IndexBitcoinEnabledComponent', () => {
	let component: IndexBitcoinEnabledComponent;
	let fixture: ComponentFixture<IndexBitcoinEnabledComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [IndexBitcoinEnabledComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexBitcoinEnabledComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
