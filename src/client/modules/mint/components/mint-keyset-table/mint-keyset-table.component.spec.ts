/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Application Dependencies */
import {MintAppModule} from '@client/modules/mint/mint.app.module';
/* Local Dependencies */
import {MintKeysetTableComponent} from './mint-keyset-table.component';

describe('MintKeysetTableComponent', () => {
	let component: MintKeysetTableComponent;
	let fixture: ComponentFixture<MintKeysetTableComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintKeysetTableComponent],
			imports: [MintAppModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintKeysetTableComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
