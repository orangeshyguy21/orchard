/* Core Dependencies */
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
/* Application Dependencies */
import { MintInfo } from '@client/modules/mint/classes/mint-info.class';
import { GraphicStatusState } from '@client/modules/graphic/types/graphic-status.types';
/* Shared Dependencies */
import { OrchardNut4Method, OrchardNut5Method } from '@shared/generated.types';

type MethodLimit = {
	method: string;
	unit: string;
	min_amount: number | null;
	max_amount: number | null;
};

@Component({
  selector: 'orc-mint-general-config',
  standalone: false,
  templateUrl: './mint-general-config.component.html',
  styleUrl: './mint-general-config.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintGeneralConfigComponent {
	public info = input.required<MintInfo | null>();

	/** Simplified list of nut numbers and their support status. */
	public nuts = computed(() => {
		const nuts = this.info()?.nuts;
		if (!nuts) return [];
		return Object.entries(nuts)
			.filter(([key]) => key.startsWith('nut'))
			.map(([key, value]) => {
				const number = parseInt(key.replace('nut', ''), 10);
				return {
					number,
					status: this.getNutStatus(number, value),
				};
			});
	});

    /** Whether minting is disabled. */
	public minting_status = computed(() => this.info()?.nuts?.nut4?.disabled ? 'inactive' : 'active');

	/** Whether melting is disabled. */
	public melting_status = computed(() => this.info()?.nuts?.nut5?.disabled ? 'inactive' : 'active');

    	/** Minting method limits from NUT4. */
	public minting_limits = computed<MethodLimit[]>(() => {
		return this.mapMethodLimits(this.info()?.nuts?.nut4?.methods);
	});

	/** Melting method limits from NUT5. */
	public melting_limits = computed<MethodLimit[]>(() => {
		return this.mapMethodLimits(this.info()?.nuts?.nut5?.methods);
	});

	/** Derives a status string from a nut number and its value. */
	private getNutStatus(number: number, nut: unknown): GraphicStatusState {
		if (nut == null || typeof nut !== 'object') return number === 4 || number === 5 ? 'inactive' : 'disabled';
		const is_disabled = 'disabled' in nut && (nut as { disabled: boolean }).disabled;
		const is_supported = 'supported' in nut && !!(nut as { supported: unknown }).supported;
		if (number === 4 || number === 5) return is_disabled ? 'inactive' : 'active';
		if ('disabled' in nut) return is_disabled ? 'disabled' : 'enabled';
		if ('supported' in nut) return is_supported ? 'enabled' : 'disabled';
		return 'enabled';
	}


	/** Maps NUT4/NUT5 methods to MethodLimit rows. */
	private mapMethodLimits(methods: (OrchardNut4Method | OrchardNut5Method)[] | undefined): MethodLimit[] {
		if (!methods) return [];
		return methods.map(m => ({
			method: m.method,
			unit: m.unit,
			min_amount: m.min_amount ?? null,
			max_amount: m.max_amount ?? null,
		}));
	}
}
