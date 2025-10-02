import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MintSDAnalyticControlPanelComponent} from './mint-sd-analytic-control-panel.component';

describe('MintSDAnalyticControlPanelComponent', () => {
	let component: MintSDAnalyticControlPanelComponent;
	let fixture: ComponentFixture<MintSDAnalyticControlPanelComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSDAnalyticControlPanelComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSDAnalyticControlPanelComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
