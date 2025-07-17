import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MintInfoFormContactComponent} from './mint-info-form-contact.component';

describe('MintInfoFormContactComponent', () => {
	let component: MintInfoFormContactComponent;
	let fixture: ComponentFixture<MintInfoFormContactComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintInfoFormContactComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintInfoFormContactComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
