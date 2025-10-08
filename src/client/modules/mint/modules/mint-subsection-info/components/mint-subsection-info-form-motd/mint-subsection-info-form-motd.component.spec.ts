/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintSubsectionInfoFormMotdComponent} from './mint-subsection-info-form-motd.component';

describe('MintSubsectionInfoFormMotdComponent', () => {
	let component: MintSubsectionInfoFormMotdComponent;
	let fixture: ComponentFixture<MintSubsectionInfoFormMotdComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionInfoFormMotdComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionInfoFormMotdComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
