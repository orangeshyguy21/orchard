/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintSubsectionKeysetsControlComponent} from './mint-subsection-keysets-control.component';

describe('MintSubsectionKeysetsControlComponent', () => {
	let component: MintSubsectionKeysetsControlComponent;
	let fixture: ComponentFixture<MintSubsectionKeysetsControlComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionKeysetsControlComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionKeysetsControlComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
