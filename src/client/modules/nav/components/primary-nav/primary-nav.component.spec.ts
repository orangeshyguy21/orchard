import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PrimaryNavComponent} from './primary-nav.component';

describe('PrimaryNavComponent', () => {
	let component: PrimaryNavComponent;
	let fixture: ComponentFixture<PrimaryNavComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [PrimaryNavComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(PrimaryNavComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
