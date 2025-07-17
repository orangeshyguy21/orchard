import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MintNameComponent} from './mint-name.component';

describe('MintNameComponent', () => {
	let component: MintNameComponent;
	let fixture: ComponentFixture<MintNameComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintNameComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintNameComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
