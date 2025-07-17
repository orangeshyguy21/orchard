import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LightningChannelTableComponent} from './lightning-channel-table.component';

describe('LightningChannelTableComponent', () => {
	let component: LightningChannelTableComponent;
	let fixture: ComponentFixture<LightningChannelTableComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [LightningChannelTableComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(LightningChannelTableComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
