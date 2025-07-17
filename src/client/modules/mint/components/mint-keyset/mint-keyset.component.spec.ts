import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MintKeysetComponent} from './mint-keyset.component';

describe('MintKeysetComponent', () => {
	let component: MintKeysetComponent;
	let fixture: ComponentFixture<MintKeysetComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintKeysetComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintKeysetComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
