/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintSubsectionInfoFormDescriptionLongComponent} from './mint-subsection-info-form-description-long.component';

describe('MintSubsectionInfoFormDescriptionLongComponent', () => {
	let component: MintSubsectionInfoFormDescriptionLongComponent;
	let fixture: ComponentFixture<MintSubsectionInfoFormDescriptionLongComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionInfoFormDescriptionLongComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionInfoFormDescriptionLongComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
