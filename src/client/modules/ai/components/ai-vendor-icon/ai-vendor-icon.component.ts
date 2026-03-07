/* Core Dependencies */
import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';

@Component({
	selector: 'orc-ai-vendor-icon',
	standalone: false,
	templateUrl: './ai-vendor-icon.component.html',
	styleUrl: './ai-vendor-icon.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[style.--icon-size]': 'size()',
	},
})
export class AiVendorIconComponent {
	/* ── Inputs ── */
	public vendor = input<string>('ollama');
	public size = input<string>('2rem');

	/* ── Public computed signals ── */
	public readonly src = computed(() => `vendor/${this.vendor()}.png`);
}
