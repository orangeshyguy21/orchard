import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MintSubsectionDatabaseTableSwapComponent} from './mint-subsection-database-table-swap.component';

describe('MintSubsectionDatabaseTableSwapComponent', () => {
	let component: MintSubsectionDatabaseTableSwapComponent;
	let fixture: ComponentFixture<MintSubsectionDatabaseTableSwapComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionDatabaseTableSwapComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionDatabaseTableSwapComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
