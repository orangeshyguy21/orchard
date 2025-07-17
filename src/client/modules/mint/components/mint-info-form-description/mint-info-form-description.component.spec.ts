import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MintInfoFormDescriptionComponent} from './mint-info-form-description.component';

describe('MintInfoFormDescriptionComponent', () => {
	let component: MintInfoFormDescriptionComponent;
	let fixture: ComponentFixture<MintInfoFormDescriptionComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintInfoFormDescriptionComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintInfoFormDescriptionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
