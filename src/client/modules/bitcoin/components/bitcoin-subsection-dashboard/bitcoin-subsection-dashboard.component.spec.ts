import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BitcoinSubsectionDashboardComponent} from './bitcoin-subsection-dashboard.component';

describe('BitcoinSubsectionDashboardComponent', () => {
	let component: BitcoinSubsectionDashboardComponent;
	let fixture: ComponentFixture<BitcoinSubsectionDashboardComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [BitcoinSubsectionDashboardComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(BitcoinSubsectionDashboardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
