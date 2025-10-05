/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintSubsectionInfoFormIconComponent} from './mint-subsection-info-form-icon.component';

describe('MintSubsectionInfoFormIconComponent', () => {
	let component: MintSubsectionInfoFormIconComponent;
	let fixture: ComponentFixture<MintSubsectionInfoFormIconComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionInfoFormIconComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionInfoFormIconComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
