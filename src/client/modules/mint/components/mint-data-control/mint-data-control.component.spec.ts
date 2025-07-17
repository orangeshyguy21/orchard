import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MintDataControlComponent} from './mint-data-control.component';

describe('MintDataControlComponent', () => {
	let component: MintDataControlComponent;
	let fixture: ComponentFixture<MintDataControlComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintDataControlComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintDataControlComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
