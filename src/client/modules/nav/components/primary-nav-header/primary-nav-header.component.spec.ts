import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PrimaryNavHeaderComponent} from './primary-nav-header.component';

describe('PrimaryNavHeaderComponent', () => {
	let component: PrimaryNavHeaderComponent;
	let fixture: ComponentFixture<PrimaryNavHeaderComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [PrimaryNavHeaderComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(PrimaryNavHeaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
