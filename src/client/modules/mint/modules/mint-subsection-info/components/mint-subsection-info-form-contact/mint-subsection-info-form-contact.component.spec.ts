/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintSubsectionInfoFormContactComponent} from './mint-subsection-info-form-contact.component';

describe('MintSubsectionInfoFormContactComponent', () => {
	let component: MintSubsectionInfoFormContactComponent;
	let fixture: ComponentFixture<MintSubsectionInfoFormContactComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionInfoFormContactComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionInfoFormContactComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
