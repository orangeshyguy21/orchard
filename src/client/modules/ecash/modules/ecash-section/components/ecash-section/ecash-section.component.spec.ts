/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcEcashSectionModule} from '@client/modules/ecash/modules/ecash-section/ecash-section.module';
/* Local Dependencies */
import {EcashSectionComponent} from './ecash-section.component';

describe('EcashSectionComponent', () => {
	let component: EcashSectionComponent;
	let fixture: ComponentFixture<EcashSectionComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcEcashSectionModule],
		}).compileComponents();

		fixture = TestBed.createComponent(EcashSectionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
