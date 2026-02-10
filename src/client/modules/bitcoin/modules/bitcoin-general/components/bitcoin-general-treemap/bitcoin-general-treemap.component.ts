/* Core Dependencies */
import {ChangeDetectionStrategy, Component, AfterViewInit, input, effect, viewChild, ElementRef} from '@angular/core';
/* Application Dependencies */
import {TreemapRect} from '@client/modules/bitcoin/helpers/treemap.helpers';

@Component({
	selector: 'orc-bitcoin-general-treemap',
	standalone: false,
	templateUrl: './bitcoin-general-treemap.component.html',
	styleUrl: './bitcoin-general-treemap.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BitcoinGeneralTreemapComponent implements AfterViewInit {
	public rects = input<TreemapRect[]>([]);
	public fullness = input<number>(0);

	private canvas = viewChild<ElementRef<HTMLCanvasElement>>('treemap_canvas');
	private initialized = false;

	constructor() {
		effect(() => {
			const rects = this.rects();
			const fullness = this.fullness();
			if (this.initialized) {
				this.draw(rects, fullness);
			}
		});
	}

	ngAfterViewInit(): void {
		this.initialized = true;
		this.draw(this.rects(), this.fullness());
	}

	/**
	 * Renders faint treemap outlines onto the canvas, clipped to fullness from bottom
	 */
	private draw(rects: TreemapRect[], fullness: number): void {
		const canvas_el = this.canvas()?.nativeElement;
		if (!canvas_el) return;
		const ctx = canvas_el.getContext('2d');
		if (!ctx) return;

		const dpr = window.devicePixelRatio || 1;
		const bounds = canvas_el.getBoundingClientRect();
		canvas_el.width = bounds.width * dpr;
		canvas_el.height = bounds.height * dpr;
		ctx.scale(dpr, dpr);
		ctx.clearRect(0, 0, bounds.width, bounds.height);

		if (rects.length === 0 || fullness <= 0) return;

		const scale_x = bounds.width / 128;
		const scale_y = bounds.height / 128;

		/* Draw all treemap lines */
		ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
		ctx.lineWidth = 0.5;
		ctx.beginPath();

		for (const r of rects) {
			const rx = r.x * scale_x;
			const ry = r.y * scale_y;
			const rw = r.width * scale_x;
			const rh = r.height * scale_y;

			ctx.moveTo(rx + rw, ry);
			ctx.lineTo(rx + rw, ry + rh);
			ctx.moveTo(rx, ry + rh);
			ctx.lineTo(rx + rw, ry + rh);
		}

		ctx.stroke();

		/* Fade out above fullness line using a gradient erase */
		const fade_y = bounds.height * (1 - Math.min(fullness, 1));
		const fade_height = bounds.height * 0.15;
		ctx.globalCompositeOperation = 'destination-out';
		const gradient = ctx.createLinearGradient(0, fade_y - fade_height, 0, fade_y);
		gradient.addColorStop(0, 'rgba(0,0,0,1)');
		gradient.addColorStop(1, 'rgba(0,0,0,0)');
		ctx.fillStyle = gradient;
		ctx.fillRect(0, fade_y - fade_height, bounds.width, fade_height);

		/* Erase everything above the fade */
		ctx.fillStyle = 'rgba(0,0,0,1)';
		ctx.fillRect(0, 0, bounds.width, Math.max(0, fade_y - fade_height));
	}
}
