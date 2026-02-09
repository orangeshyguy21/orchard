import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LightningGeneralInfoComponent} from './lightning-general-info.component';

describe('LightningGeneralInfoComponent', () => {
	let component: LightningGeneralInfoComponent;
	let fixture: ComponentFixture<LightningGeneralInfoComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [LightningGeneralInfoComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(LightningGeneralInfoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
