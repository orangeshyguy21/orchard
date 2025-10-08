import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LightningSubsectionDisabledComponent} from './lightning-subsection-disabled.component';

describe('LightningSubsectionDisabledComponent', () => {
	let component: LightningSubsectionDisabledComponent;
	let fixture: ComponentFixture<LightningSubsectionDisabledComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [LightningSubsectionDisabledComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(LightningSubsectionDisabledComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
