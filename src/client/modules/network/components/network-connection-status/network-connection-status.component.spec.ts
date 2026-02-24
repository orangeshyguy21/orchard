/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcNetworkModule} from '@client/modules/network/network.module';
/* Local Dependencies */
import {NetworkConnectionStatusComponent} from './network-connection-status.component';

describe('NetworkConnectionStatusComponent', () => {
    let component: NetworkConnectionStatusComponent;
    let fixture: ComponentFixture<NetworkConnectionStatusComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [OrcNetworkModule],
        }).compileComponents();

        fixture = TestBed.createComponent(NetworkConnectionStatusComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('type', 'insecure');
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
