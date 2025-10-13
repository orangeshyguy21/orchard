/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivatedRoute} from '@angular/router';
/* Native Dependencies */
import {OrcMintSubsectionDatabaseModule} from '@client/modules/mint/modules/mint-subsection-database/mint-subsection-database.module';
/* Local Dependencies */
import {MintSubsectionDatabaseComponent} from './mint-subsection-database.component';

describe('MintSubsectionDatabaseComponent', () => {
	let component: MintSubsectionDatabaseComponent;
	let fixture: ComponentFixture<MintSubsectionDatabaseComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionDatabaseModule],
			declarations: [MintSubsectionDatabaseComponent],
			providers: [
				{provide: ActivatedRoute, useValue: {snapshot: {data: {mint_keysets: []}}}},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionDatabaseComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
