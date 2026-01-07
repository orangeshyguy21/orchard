/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, viewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MatMenuTrigger} from '@angular/material/menu';
/* Native Dependencies */
import {CrewState} from '@client/modules/index/modules/index-subsection-crew/enums/crew-entity.enum';
import {StateOption, RoleOption} from '@client/modules/index/modules/index-subsection-crew/types/crew-panel.types';
/* Shared Dependencies */
import {UserRole} from '@shared/generated.types';

@Component({
	selector: 'orc-index-subsection-crew-control',
	standalone: false,
	templateUrl: './index-subsection-crew-control.component.html',
	styleUrl: './index-subsection-crew-control.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexSubsectionCrewControlComponent {
	public form_group = input.required<FormGroup>();
	public state_options = input.required<StateOption[]>();
	public role_options = input.required<RoleOption[]>();
	public filter_count = input.required<number>();

	private filter_menu_trigger = viewChild(MatMenuTrigger);

	public isStateSelected(state: CrewState): boolean {
		const current: CrewState[] = this.form_group().get('state')?.value || [];
		return current.includes(state);
	}

	public isRoleSelected(role: UserRole): boolean {
		const current: UserRole[] = this.form_group().get('role')?.value || [];
		return current.includes(role);
	}

	public onStateToggle(state: CrewState): void {
		const current: CrewState[] = this.form_group().get('state')?.value || [];
		const updated = current.includes(state) ? current.filter((s) => s !== state) : [...current, state];
		this.form_group().get('state')?.setValue(updated);
	}

	public onRoleToggle(role: UserRole): void {
		const current: UserRole[] = this.form_group().get('role')?.value || [];
		const updated = current.includes(role) ? current.filter((r) => r !== role) : [...current, role];
		this.form_group().get('role')?.setValue(updated);
	}

	public onClearFilter(): void {
		this.form_group().get('state')?.setValue([]);
		this.form_group().get('role')?.setValue([]);
		this.filter_menu_trigger()?.closeMenu();
	}

	public onCloseFilter(): void {
		this.filter_menu_trigger()?.closeMenu();
	}
}
