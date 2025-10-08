/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintSubsectionDatabaseTableEcashComponent} from './mint-subsection-database-table-ecash.component';

describe('MintSubsectionDatabaseTableEcashComponent', () => {
	let component: MintSubsectionDatabaseTableEcashComponent;
	let fixture: ComponentFixture<MintSubsectionDatabaseTableEcashComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionDatabaseTableEcashComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionDatabaseTableEcashComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
