import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MintSubsectionConfigNut29Component} from './mint-subsection-config-nut29.component';

describe('MintSubsectionConfigNut29Component', () => {
	let component: MintSubsectionConfigNut29Component;
	let fixture: ComponentFixture<MintSubsectionConfigNut29Component>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionConfigNut29Component],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionConfigNut29Component);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
