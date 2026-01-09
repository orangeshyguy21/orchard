import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MintSubsectionConfigFormQuoteTtlStatsComponent} from './mint-subsection-config-form-quote-ttl-stats.component';

describe('MintSubsectionConfigFormQuoteTtlStatsComponent', () => {
	let component: MintSubsectionConfigFormQuoteTtlStatsComponent;
	let fixture: ComponentFixture<MintSubsectionConfigFormQuoteTtlStatsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionConfigFormQuoteTtlStatsComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionConfigFormQuoteTtlStatsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
