import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MintInfoFormUrlsComponent} from './mint-info-form-urls.component';

describe('MintInfoFormUrlsComponent', () => {
	let component: MintInfoFormUrlsComponent;
	let fixture: ComponentFixture<MintInfoFormUrlsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintInfoFormUrlsComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintInfoFormUrlsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
