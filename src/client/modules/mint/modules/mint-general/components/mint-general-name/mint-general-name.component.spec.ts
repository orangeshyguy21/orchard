/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter, Router} from '@angular/router';
/* Native Dependencies */
import {OrcMintGeneralModule} from '@client/modules/mint/modules/mint-general/mint-general.module';
/* Local Dependencies */
import {MintGeneralNameComponent} from './mint-general-name.component';

describe('MintGeneralNameComponent', () => {
	let component: MintGeneralNameComponent;
	let fixture: ComponentFixture<MintGeneralNameComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintGeneralModule],
			providers: [provideRouter([])],
		}).compileComponents();

		fixture = TestBed.createComponent(MintGeneralNameComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('state', () => {
		it('should return loading when loading is true', () => {
			fixture.componentRef.setInput('loading', true);
			fixture.detectChanges();
			expect(component.state()).toBe('loading');
		});

		it('should return error when error is true and not loading', () => {
			fixture.componentRef.setInput('error', true);
			fixture.detectChanges();
			expect(component.state()).toBe('error');
		});

		it('should return name when name is set and not loading or errored', () => {
			fixture.componentRef.setInput('name', 'Test Mint');
			fixture.detectChanges();
			expect(component.state()).toBe('name');
		});

		it('should return unset when no name, loading, or error', () => {
			expect(component.state()).toBe('unset');
		});
	});

	describe('onClick', () => {
		it('should navigate to mint info with name focus state', () => {
			const router = TestBed.inject(Router);
			const navigate_spy = spyOn(router, 'navigate').and.stub();

			component.onClick();

			expect(navigate_spy).toHaveBeenCalledWith(['mint', 'info'], {state: {focus_control: 'name'}});
		});
	});
});
