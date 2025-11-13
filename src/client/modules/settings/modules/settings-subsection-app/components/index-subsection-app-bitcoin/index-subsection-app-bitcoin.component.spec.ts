import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IndexSubsectionAppBitcoinComponent} from './index-subsection-app-bitcoin.component';

describe('IndexSubsectionAppBitcoinComponent', () => {
	let component: IndexSubsectionAppBitcoinComponent;
	let fixture: ComponentFixture<IndexSubsectionAppBitcoinComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [IndexSubsectionAppBitcoinComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionAppBitcoinComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
