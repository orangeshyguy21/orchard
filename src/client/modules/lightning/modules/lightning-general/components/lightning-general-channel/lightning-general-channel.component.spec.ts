/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {LightningGeneralChannelComponent} from './lightning-general-channel.component';

describe('LightningGeneralChannelComponent', () => {
	let component: LightningGeneralChannelComponent;
	let fixture: ComponentFixture<LightningGeneralChannelComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [LightningGeneralChannelComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(LightningGeneralChannelComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
