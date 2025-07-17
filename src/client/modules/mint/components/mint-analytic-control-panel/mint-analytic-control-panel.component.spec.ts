import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MintAnalyticControlPanelComponent} from './mint-analytic-control-panel.component';

describe('MintAnalyticControlPanelComponent', () => {
	let component: MintAnalyticControlPanelComponent;
	let fixture: ComponentFixture<MintAnalyticControlPanelComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintAnalyticControlPanelComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintAnalyticControlPanelComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
