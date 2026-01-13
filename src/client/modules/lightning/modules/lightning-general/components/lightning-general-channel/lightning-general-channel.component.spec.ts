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
		fixture.componentRef.setInput('size', 100);
		fixture.componentRef.setInput('recievable', 50);
		fixture.componentRef.setInput('sendable', 50);
		fixture.componentRef.setInput('unit', 'sat');
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
