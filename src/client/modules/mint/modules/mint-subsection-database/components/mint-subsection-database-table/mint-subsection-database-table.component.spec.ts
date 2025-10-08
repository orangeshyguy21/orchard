/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintSubsectionDatabaseTableComponent} from './mint-subsection-database-table.component';

describe('MintSubsectionDatabaseTableComponent', () => {
	let component: MintSubsectionDatabaseTableComponent;
	let fixture: ComponentFixture<MintSubsectionDatabaseTableComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionDatabaseTableComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionDatabaseTableComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
