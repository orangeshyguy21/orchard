import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MintSubsectionConfigNut22Component} from './mint-subsection-config-nut22.component';

describe('MintSubsectionConfigNut22Component', () => {
	let component: MintSubsectionConfigNut22Component;
	let fixture: ComponentFixture<MintSubsectionConfigNut22Component>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionConfigNut22Component],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionConfigNut22Component);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
