/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintSDConnectionsComponent} from './mint-sd-connections.component';

describe('MintSDConnectionsComponent', () => {
	let component: MintSDConnectionsComponent;
	let fixture: ComponentFixture<MintSDConnectionsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSDConnectionsComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSDConnectionsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
