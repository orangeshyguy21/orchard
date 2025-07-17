import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MintKeysetTableComponent} from './mint-keyset-table.component';

describe('MintKeysetTableComponent', () => {
	let component: MintKeysetTableComponent;
	let fixture: ComponentFixture<MintKeysetTableComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintKeysetTableComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintKeysetTableComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
