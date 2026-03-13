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
	public readonly src = computed(() => `ai-vendor/${this.vendor()}.png`);

	/** Falls back to the OpenRouter logo when the vendor image is missing */
	public onImageError(event: Event): void {
		const img = event.target as HTMLImageElement;
		if (!img.src.endsWith('ai-vendor/openrouter.png')) {
			img.src = 'ai-vendor/openrouter.png';
		}
	}
}
