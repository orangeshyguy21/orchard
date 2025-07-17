import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MintConfigFormNut15MethodComponent} from './mint-config-form-nut15-method.component';

describe('MintConfigFormNut15MethodComponent', () => {
	let component: MintConfigFormNut15MethodComponent;
	let fixture: ComponentFixture<MintConfigFormNut15MethodComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintConfigFormNut15MethodComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintConfigFormNut15MethodComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
