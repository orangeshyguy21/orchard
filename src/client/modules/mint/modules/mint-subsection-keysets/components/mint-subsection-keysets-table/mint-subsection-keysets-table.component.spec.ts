/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintSubsectionKeysetsTableComponent} from './mint-subsection-keysets-table.component';

describe('MintSubsectionKeysetsTableComponent', () => {
	let component: MintSubsectionKeysetsTableComponent;
	let fixture: ComponentFixture<MintSubsectionKeysetsTableComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionKeysetsTableComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionKeysetsTableComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
