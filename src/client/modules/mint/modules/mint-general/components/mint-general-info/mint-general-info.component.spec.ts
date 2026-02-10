import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MintGeneralInfoComponent} from './mint-general-info.component';

describe('MintGeneralInfoComponent', () => {
	let component: MintGeneralInfoComponent;
	let fixture: ComponentFixture<MintGeneralInfoComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintGeneralInfoComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintGeneralInfoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
