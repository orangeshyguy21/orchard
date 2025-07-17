import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MintInfoFormDescriptionLongComponent} from './mint-info-form-description-long.component';

describe('MintInfoFormDescriptionLongComponent', () => {
	let component: MintInfoFormDescriptionLongComponent;
	let fixture: ComponentFixture<MintInfoFormDescriptionLongComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintInfoFormDescriptionLongComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintInfoFormDescriptionLongComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
