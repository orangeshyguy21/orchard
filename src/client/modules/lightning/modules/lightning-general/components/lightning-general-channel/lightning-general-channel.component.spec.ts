/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcLightningGeneralModule} from '@client/modules/lightning/modules/lightning-general/lightning-general.module';
/* Local Dependencies */
import {LightningGeneralChannelComponent} from './lightning-general-channel.component';

describe('LightningGeneralChannelComponent', () => {
	let component: LightningGeneralChannelComponent;
	let fixture: ComponentFixture<LightningGeneralChannelComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcLightningGeneralModule],
			declarations: [LightningGeneralChannelComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(LightningGeneralChannelComponent);
		component = fixture.componentInstance;
		component.size = 100;
		component.recievable = 50;
		component.sendable = 50;
		component.unit = 'sat';
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
