import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IndexSubsectionAppComponent} from './index-subsection-app.component';

describe('IndexSubsectionAppComponent', () => {
	let component: IndexSubsectionAppComponent;
	let fixture: ComponentFixture<IndexSubsectionAppComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [IndexSubsectionAppComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionAppComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
