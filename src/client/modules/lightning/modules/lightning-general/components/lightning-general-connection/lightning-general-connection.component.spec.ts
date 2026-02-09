import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LightningGeneralConnectionComponent} from './lightning-general-connection.component';

describe('LightningGeneralConnectionComponent', () => {
	let component: LightningGeneralConnectionComponent;
	let fixture: ComponentFixture<LightningGeneralConnectionComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [LightningGeneralConnectionComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(LightningGeneralConnectionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
