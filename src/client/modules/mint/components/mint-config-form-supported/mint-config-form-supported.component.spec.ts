import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MintConfigFormSupportedComponent} from './mint-config-form-supported.component';

describe('MintConfigFormSupportedComponent', () => {
	let component: MintConfigFormSupportedComponent;
	let fixture: ComponentFixture<MintConfigFormSupportedComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintConfigFormSupportedComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintConfigFormSupportedComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
