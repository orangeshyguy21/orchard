import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TertiaryNavComponent} from './tertiary-nav.component';

describe('TertiaryNavComponent', () => {
	let component: TertiaryNavComponent;
	let fixture: ComponentFixture<TertiaryNavComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [TertiaryNavComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(TertiaryNavComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
