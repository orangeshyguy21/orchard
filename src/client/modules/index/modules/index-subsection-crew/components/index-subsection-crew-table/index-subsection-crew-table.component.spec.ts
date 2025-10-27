import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IndexSubsectionCrewTableComponent} from './index-subsection-crew-table.component';

describe('IndexSubsectionCrewTableComponent', () => {
	let component: IndexSubsectionCrewTableComponent;
	let fixture: ComponentFixture<IndexSubsectionCrewTableComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [IndexSubsectionCrewTableComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionCrewTableComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
