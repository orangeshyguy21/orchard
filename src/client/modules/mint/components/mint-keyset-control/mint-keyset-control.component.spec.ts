import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MintKeysetControlComponent} from './mint-keyset-control.component';

describe('MintKeysetControlComponent', () => {
	let component: MintKeysetControlComponent;
	let fixture: ComponentFixture<MintKeysetControlComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintKeysetControlComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintKeysetControlComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
