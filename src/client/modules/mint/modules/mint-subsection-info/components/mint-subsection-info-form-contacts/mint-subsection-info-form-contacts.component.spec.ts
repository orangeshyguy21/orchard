/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintSubsectionInfoFormContactsComponent} from './mint-subsection-info-form-contacts.component';

describe('MintSubsectionInfoFormContactsComponent', () => {
	let component: MintSubsectionInfoFormContactsComponent;
	let fixture: ComponentFixture<MintSubsectionInfoFormContactsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionInfoFormContactsComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionInfoFormContactsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
