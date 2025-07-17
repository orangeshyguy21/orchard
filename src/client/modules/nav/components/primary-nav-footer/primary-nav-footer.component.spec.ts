import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PrimaryNavFooterComponent} from './primary-nav-footer.component';

describe('PrimaryNavFooterComponent', () => {
	let component: PrimaryNavFooterComponent;
	let fixture: ComponentFixture<PrimaryNavFooterComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [PrimaryNavFooterComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(PrimaryNavFooterComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
