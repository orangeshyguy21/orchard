import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MintConfigFormMaxComponent} from './mint-config-form-max.component';

describe('MintConfigFormMaxComponent', () => {
	let component: MintConfigFormMaxComponent;
	let fixture: ComponentFixture<MintConfigFormMaxComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintConfigFormMaxComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintConfigFormMaxComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
