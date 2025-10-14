/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcMintSubsectionKeysetsModule} from '@client/modules/mint/modules/mint-subsection-keysets/mint-subsection-keysets.module';
/* Local Dependencies */
import {MintSubsectionKeysetsControlComponent} from './mint-subsection-keysets-control.component';

describe('MintSubsectionKeysetsControlComponent', () => {
	let component: MintSubsectionKeysetsControlComponent;
	let fixture: ComponentFixture<MintSubsectionKeysetsControlComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionKeysetsModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionKeysetsControlComponent);
		component = fixture.componentInstance;
		component.loading = true;
		component.page_settings = {date_start: 0, date_end: 0, units: [], status: []} as any;
		component.keysets = [] as any;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
