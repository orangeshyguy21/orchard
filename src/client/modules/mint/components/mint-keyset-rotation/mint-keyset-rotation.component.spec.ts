import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MintKeysetRotationComponent} from './mint-keyset-rotation.component';

describe('MintKeysetRotationComponent', () => {
	let component: MintKeysetRotationComponent;
	let fixture: ComponentFixture<MintKeysetRotationComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintKeysetRotationComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintKeysetRotationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
