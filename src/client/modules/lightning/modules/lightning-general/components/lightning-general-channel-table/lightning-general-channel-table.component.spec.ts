/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcLightningGeneralModule} from '@client/modules/lightning/modules/lightning-general/lightning-general.module';
/* Local Dependencies */
import {LightningGeneralChannelTableComponent} from './lightning-general-channel-table.component';

describe('LightningGeneralChannelTableComponent', () => {
	let component: LightningGeneralChannelTableComponent;
	let fixture: ComponentFixture<LightningGeneralChannelTableComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcLightningGeneralModule],
		}).compileComponents();

		fixture = TestBed.createComponent(LightningGeneralChannelTableComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
