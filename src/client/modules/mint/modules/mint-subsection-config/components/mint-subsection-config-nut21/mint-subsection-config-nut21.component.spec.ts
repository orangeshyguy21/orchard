import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MintSubsectionConfigNut21Component} from './mint-subsection-config-nut21.component';

describe('MintSubsectionConfigNut21Component', () => {
	let component: MintSubsectionConfigNut21Component;
	let fixture: ComponentFixture<MintSubsectionConfigNut21Component>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionConfigNut21Component],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionConfigNut21Component);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
