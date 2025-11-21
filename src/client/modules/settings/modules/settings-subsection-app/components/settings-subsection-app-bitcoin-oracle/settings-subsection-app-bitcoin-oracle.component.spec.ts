/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcSettingsSubsectionAppModule} from '@client/modules/settings/modules/settings-subsection-app/settings-subsection-app.module';
/* Local Dependencies */
import {SettingsSubsectionAppBitcoinOracleComponent} from './settings-subsection-app-bitcoin-oracle.component';

describe('SettingsSubsectionAppBitcoinOracleComponent', () => {
	let component: SettingsSubsectionAppBitcoinOracleComponent;
	let fixture: ComponentFixture<SettingsSubsectionAppBitcoinOracleComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcSettingsSubsectionAppModule],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionAppBitcoinOracleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
