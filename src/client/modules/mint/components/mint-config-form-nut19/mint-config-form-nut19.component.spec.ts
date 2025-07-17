import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MintConfigFormNut19Component} from './mint-config-form-nut19.component';

describe('MintConfigFormNut19Component', () => {
	let component: MintConfigFormNut19Component;
	let fixture: ComponentFixture<MintConfigFormNut19Component>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintConfigFormNut19Component],
		}).compileComponents();

		fixture = TestBed.createComponent(MintConfigFormNut19Component);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
