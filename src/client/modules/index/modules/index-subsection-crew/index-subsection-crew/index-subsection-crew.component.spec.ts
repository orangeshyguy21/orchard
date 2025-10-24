import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IndexSubsectionCrewComponent} from './index-subsection-crew.component';

describe('IndexSubsectionCrewComponent', () => {
	let component: IndexSubsectionCrewComponent;
	let fixture: ComponentFixture<IndexSubsectionCrewComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [IndexSubsectionCrewComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionCrewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
