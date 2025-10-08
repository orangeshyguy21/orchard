import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IndexBitcoinSyncingComponent} from './index-bitcoin-syncing.component';

describe('IndexBitcoinSyncingComponent', () => {
	let component: IndexBitcoinSyncingComponent;
	let fixture: ComponentFixture<IndexBitcoinSyncingComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [IndexBitcoinSyncingComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexBitcoinSyncingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
