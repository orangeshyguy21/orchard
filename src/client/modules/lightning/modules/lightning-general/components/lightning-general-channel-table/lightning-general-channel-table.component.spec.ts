/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {LightningGeneralChannelTableComponent} from './lightning-general-channel-table.component';

describe('LightningGeneralChannelTableComponent', () => {
	let component: LightningGeneralChannelTableComponent;
	let fixture: ComponentFixture<LightningGeneralChannelTableComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [LightningGeneralChannelTableComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(LightningGeneralChannelTableComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
