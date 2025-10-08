/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcMintSubsectionKeysetsModule} from '@client/modules/mint/modules/mint-subsection-keysets/mint-subsection-keysets.module';
/* Local Dependencies */
import {MintSubsectionKeysetsTableComponent} from './mint-subsection-keysets-table.component';

describe('MintSubsectionKeysetsTableComponent', () => {
	let component: MintSubsectionKeysetsTableComponent;
	let fixture: ComponentFixture<MintSubsectionKeysetsTableComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionKeysetsModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionKeysetsTableComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
