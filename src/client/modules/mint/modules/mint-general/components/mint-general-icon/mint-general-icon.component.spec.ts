import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MintGeneralIconComponent} from './mint-general-icon.component';

describe('MintGeneralIconComponent', () => {
	let component: MintGeneralIconComponent;
	let fixture: ComponentFixture<MintGeneralIconComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintGeneralIconComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintGeneralIconComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
