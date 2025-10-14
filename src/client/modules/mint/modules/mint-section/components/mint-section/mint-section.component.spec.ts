/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';
/* Native Dependencies */
import {OrcMintSectionModule} from '@client/modules/mint/modules/mint-section/mint-section.module';
/* Local Dependencies */
import {MintSectionComponent} from './mint-section.component';

describe('MintSectionComponent', () => {
	let component: MintSectionComponent;
	let fixture: ComponentFixture<MintSectionComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSectionModule],
			providers: [provideRouter([])],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSectionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
