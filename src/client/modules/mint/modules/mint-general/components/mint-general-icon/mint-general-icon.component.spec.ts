/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter, Router} from '@angular/router';
/* Native Dependencies */
import {OrcMintGeneralModule} from '@client/modules/mint/modules/mint-general/mint-general.module';
/* Local Dependencies */
import {MintGeneralIconComponent} from './mint-general-icon.component';

describe('MintGeneralIconComponent', () => {
	let component: MintGeneralIconComponent;
	let fixture: ComponentFixture<MintGeneralIconComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintGeneralModule],
			providers: [provideRouter([])],
		}).compileComponents();

		fixture = TestBed.createComponent(MintGeneralIconComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('icon_data', null);
		fixture.componentRef.setInput('loading', false);
		fixture.componentRef.setInput('error', false);
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

		it('should return icon when icon_data is present and not loading or errored', () => {
			fixture.componentRef.setInput('icon_data', 'data:image/png;base64,xyz');
			fixture.detectChanges();
			expect(component.state()).toBe('icon');
		});

		it('should return unset when no loading, error, or icon_data', () => {
			expect(component.state()).toBe('unset');
		});
	});

	describe('onClick', () => {
		it('should navigate to mint info with icon_url focus state', () => {
			const router = TestBed.inject(Router);
			const navigate_spy = spyOn(router, 'navigate').and.stub();

			component.onClick();

			expect(navigate_spy).toHaveBeenCalledWith(['mint', 'info'], {state: {focus_control: 'icon_url'}});
		});
	});
});
