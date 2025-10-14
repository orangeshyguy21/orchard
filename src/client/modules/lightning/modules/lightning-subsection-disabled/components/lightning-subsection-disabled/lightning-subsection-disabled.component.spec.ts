/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcLightningSubsectionDisabledModule} from '@client/modules/lightning/modules/lightning-subsection-disabled/lightning-subsection-disabled.module';
/* Local Dependencies */
import {LightningSubsectionDisabledComponent} from './lightning-subsection-disabled.component';

describe('LightningSubsectionDisabledComponent', () => {
	let component: LightningSubsectionDisabledComponent;
	let fixture: ComponentFixture<LightningSubsectionDisabledComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcLightningSubsectionDisabledModule],
		}).compileComponents();

		fixture = TestBed.createComponent(LightningSubsectionDisabledComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
