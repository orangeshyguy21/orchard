import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MintSubsectionDatabaseComponent} from './mint-subsection-database.component';

describe('MintSubsectionDatabaseComponent', () => {
	let component: MintSubsectionDatabaseComponent;
	let fixture: ComponentFixture<MintSubsectionDatabaseComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionDatabaseComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionDatabaseComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
