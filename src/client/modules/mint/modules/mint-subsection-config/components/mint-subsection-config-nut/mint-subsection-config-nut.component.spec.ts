/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintSubsectionConfigNutComponent} from './mint-subsection-config-nut.component';

describe('MintSubsectionConfigNutComponent', () => {
	let component: MintSubsectionConfigNutComponent;
	let fixture: ComponentFixture<MintSubsectionConfigNutComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionConfigNutComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionConfigNutComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
