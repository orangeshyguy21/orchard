/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintSubsectionConfigNutSupportedComponent} from './mint-subsection-config-nut-supported.component';

describe('MintSubsectionConfigNutSupportedComponent', () => {
	let component: MintSubsectionConfigNutSupportedComponent;
	let fixture: ComponentFixture<MintSubsectionConfigNutSupportedComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionConfigNutSupportedComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionConfigNutSupportedComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
