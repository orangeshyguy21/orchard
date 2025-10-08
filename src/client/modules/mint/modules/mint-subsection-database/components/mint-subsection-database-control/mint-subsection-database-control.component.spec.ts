/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintSubsectionDatabaseControlComponent} from './mint-subsection-database-control.component';

describe('MintSubsectionDatabaseControlComponent', () => {
	let component: MintSubsectionDatabaseControlComponent;
	let fixture: ComponentFixture<MintSubsectionDatabaseControlComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionDatabaseControlComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionDatabaseControlComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
