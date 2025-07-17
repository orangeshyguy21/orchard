import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MintDataMintComponent} from './mint-data-mint.component';

describe('MintDataMintComponent', () => {
	let component: MintDataMintComponent;
	let fixture: ComponentFixture<MintDataMintComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintDataMintComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintDataMintComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
