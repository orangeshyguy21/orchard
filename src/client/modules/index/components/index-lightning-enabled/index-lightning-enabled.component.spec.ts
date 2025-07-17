import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IndexLightningEnabledComponent} from './index-lightning-enabled.component';

describe('IndexLightningEnabledComponent', () => {
	let component: IndexLightningEnabledComponent;
	let fixture: ComponentFixture<IndexLightningEnabledComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [IndexLightningEnabledComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexLightningEnabledComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
