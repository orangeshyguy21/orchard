import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MintKeysetRotationPreviewComponent} from './mint-keyset-rotation-preview.component';

describe('MintKeysetRotationPreviewComponent', () => {
	let component: MintKeysetRotationPreviewComponent;
	let fixture: ComponentFixture<MintKeysetRotationPreviewComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintKeysetRotationPreviewComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintKeysetRotationPreviewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
