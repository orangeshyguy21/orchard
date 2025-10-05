/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintSubsectionInfoFormDescriptionComponent} from './mint-subsection-info-form-description.component';

describe('MintSubsectionInfoFormDescriptionComponent', () => {
	let component: MintSubsectionInfoFormDescriptionComponent;
	let fixture: ComponentFixture<MintSubsectionInfoFormDescriptionComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionInfoFormDescriptionComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionInfoFormDescriptionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
