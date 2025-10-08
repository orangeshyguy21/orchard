import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IndexEcashDisabledComponent} from './index-ecash-disabled.component';

describe('IndexEcashDisabledComponent', () => {
	let component: IndexEcashDisabledComponent;
	let fixture: ComponentFixture<IndexEcashDisabledComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [IndexEcashDisabledComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexEcashDisabledComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
