import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MintInfoFormContactsComponent} from './mint-info-form-contacts.component';

describe('MintInfoFormContactsComponent', () => {
	let component: MintInfoFormContactsComponent;
	let fixture: ComponentFixture<MintInfoFormContactsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintInfoFormContactsComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintInfoFormContactsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
