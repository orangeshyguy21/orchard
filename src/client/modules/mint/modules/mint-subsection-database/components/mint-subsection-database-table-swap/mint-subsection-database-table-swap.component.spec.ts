/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcMintSubsectionDatabaseModule} from '@client/modules/mint/modules/mint-subsection-database/mint-subsection-database.module';
/* Local Dependencies */
import {MintSubsectionDatabaseTableSwapComponent} from './mint-subsection-database-table-swap.component';

describe('MintSubsectionDatabaseTableSwapComponent', () => {
    let component: MintSubsectionDatabaseTableSwapComponent;
    let fixture: ComponentFixture<MintSubsectionDatabaseTableSwapComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [OrcMintSubsectionDatabaseModule],
        }).compileComponents();

        fixture = TestBed.createComponent(MintSubsectionDatabaseTableSwapComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('swap', {keyset_ids: [], amount: 0, fee: 0, created_time: 0, unit: 'sat'});
        fixture.componentRef.setInput('keysets', []);
        fixture.componentRef.setInput('bitcoin_oracle_data', null);
        fixture.componentRef.setInput('device_desktop', true);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
