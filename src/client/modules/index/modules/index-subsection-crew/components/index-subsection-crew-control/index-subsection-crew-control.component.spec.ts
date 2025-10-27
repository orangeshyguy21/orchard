import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IndexSubsectionCrewControlComponent} from './index-subsection-crew-control.component';

describe('IndexSubsectionCrewControlComponent', () => {
	let component: IndexSubsectionCrewControlComponent;
	let fixture: ComponentFixture<IndexSubsectionCrewControlComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [IndexSubsectionCrewControlComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionCrewControlComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
