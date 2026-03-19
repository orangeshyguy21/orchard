/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Vendor Dependencies */
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
/* Native Dependencies */
import {OrcFormModule} from '@client/modules/form/form.module';
import {FormCronBuilderComponent} from './form-cron-builder.component';

describe('FormCronBuilderComponent', () => {
	let component: FormCronBuilderComponent;
	let fixture: ComponentFixture<FormCronBuilderComponent>;
	let dialog_ref_spy: jasmine.SpyObj<MatDialogRef<FormCronBuilderComponent>>;

	beforeEach(async () => {
		dialog_ref_spy = jasmine.createSpyObj('MatDialogRef', ['close']);

		await TestBed.configureTestingModule({
			imports: [OrcFormModule, NoopAnimationsModule],
			providers: [
				{provide: MatDialogRef, useValue: dialog_ref_spy},
				{provide: MAT_DIALOG_DATA, useValue: {cron: null}},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(FormCronBuilderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should default to hourly tab', () => {
		expect(component.active_tab()).toBe(0);
	});

	it('should generate hourly cron expression', () => {
		component.active_tab.set(0);
		component.hourly_every.set(2);
		component.hourly_minute.set(15);
		expect(component.cron_expression()).toBe('15 */2 * * *');
	});

	it('should generate daily cron expression', () => {
		component.active_tab.set(1);
		component.daily_every.set(1);
		component.daily_hour.set(9);
		component.daily_minute.set(30);
		component.daily_period.set('AM');
		expect(component.cron_expression()).toBe('30 9 * * *');
	});

	it('should generate weekly cron expression', () => {
		component.active_tab.set(2);
		component.weekly_days.set([true, false, false, false, true, false, false]);
		component.weekly_hour.set(8);
		component.weekly_minute.set(0);
		component.weekly_period.set('AM');
		expect(component.cron_expression()).toBe('0 8 * * 1,5');
	});

	it('should generate monthly day cron expression', () => {
		component.active_tab.set(3);
		component.monthly_mode.set('day');
		component.monthly_day.set(15);
		component.monthly_every.set(2);
		component.monthly_hour.set(10);
		component.monthly_minute.set(0);
		component.monthly_period.set('AM');
		expect(component.cron_expression()).toBe('0 10 15 */2 *');
	});

	it('should generate yearly day cron expression', () => {
		component.active_tab.set(4);
		component.yearly_mode.set('day');
		component.yearly_month.set(6);
		component.yearly_day.set(1);
		component.yearly_hour.set(12);
		component.yearly_minute.set(0);
		component.yearly_period.set('PM');
		expect(component.cron_expression()).toBe('0 12 1 6 *');
	});

	it('should close dialog with cron on save', () => {
		component.active_tab.set(0);
		component.hourly_every.set(1);
		component.hourly_minute.set(0);
		component.onSave();
		expect(dialog_ref_spy.close).toHaveBeenCalledWith('0 * * * *');
	});

	it('should close dialog without value on cancel', () => {
		component.onCancel();
		expect(dialog_ref_spy.close).toHaveBeenCalledWith();
	});
});

describe('FormCronBuilderComponent (edit mode)', () => {
	let component: FormCronBuilderComponent;
	let fixture: ComponentFixture<FormCronBuilderComponent>;

	function createComponent(cron: string): FormCronBuilderComponent {
		TestBed.resetTestingModule();
		TestBed.configureTestingModule({
			imports: [OrcFormModule, NoopAnimationsModule],
			providers: [
				{provide: MatDialogRef, useValue: jasmine.createSpyObj('MatDialogRef', ['close'])},
				{provide: MAT_DIALOG_DATA, useValue: {cron}},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(FormCronBuilderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		return component;
	}

	it('should parse hourly cron', () => {
		const comp = createComponent('30 */3 * * *');
		expect(comp.active_tab()).toBe(0);
		expect(comp.hourly_every()).toBe(3);
		expect(comp.hourly_minute()).toBe(30);
	});

	it('should parse daily cron', () => {
		const comp = createComponent('0 14 * * *');
		expect(comp.active_tab()).toBe(1);
		expect(comp.daily_hour()).toBe(2);
		expect(comp.daily_minute()).toBe(0);
		expect(comp.daily_period()).toBe('PM');
	});

	it('should parse weekly cron', () => {
		const comp = createComponent('0 9 * * 1,3,5');
		expect(comp.active_tab()).toBe(2);
		expect(comp.weekly_days()).toEqual([true, false, true, false, true, false, false]);
	});

	it('should parse monthly day cron', () => {
		const comp = createComponent('0 10 15 */2 *');
		expect(comp.active_tab()).toBe(3);
		expect(comp.monthly_mode()).toBe('day');
		expect(comp.monthly_day()).toBe(15);
		expect(comp.monthly_every()).toBe(2);
	});

	it('should parse yearly day cron', () => {
		const comp = createComponent('0 12 1 6 *');
		expect(comp.active_tab()).toBe(4);
		expect(comp.yearly_mode()).toBe('day');
		expect(comp.yearly_month()).toBe(6);
		expect(comp.yearly_day()).toBe(1);
	});
});
