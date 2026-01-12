import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CrewGeneralUserIconComponent} from './crew-general-user-icon.component';

describe('CrewGeneralUserIconComponent', () => {
	let component: CrewGeneralUserIconComponent;
	let fixture: ComponentFixture<CrewGeneralUserIconComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [CrewGeneralUserIconComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(CrewGeneralUserIconComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
