/* Core Dependencies */
import {ChangeDetectionStrategy, Component, computed, input, signal} from '@angular/core';
/* Application Dependencies */
import {
	computeFacehash,
	FACEHASH_COLORS,
	type FacehashVariant,
	getFacehashColor,
	INTENSITY_PRESETS,
	type Intensity3D,
} from '../../helpers/facehash.helper';

@Component({
	selector: 'orc-crew-facehash',
	standalone: false,
	templateUrl: './crew-facehash.component.html',
	styleUrl: './crew-facehash.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrewFacehashComponent {
	public name = input.required<string>(); // string to hash
	public size = input<string>('2rem'); // CSS width & height
	public variant = input<FacehashVariant>('gradient'); // gradient or solid bg
	public intensity = input<Intensity3D>('dramatic'); // 3D rotation level
	public interactive = input<boolean>(true); // hover to face forward
	public showInitial = input<boolean>(true); // show first letter
	public enableBlink = input<boolean>(false); // blink animation
	public colors = input<readonly string[]>(FACEHASH_COLORS); // color palette
	public is_hovered = signal(false);

	/** Computed face data derived from the name */
	public face_data = computed(() => {
		return computeFacehash(this.name(), this.colors().length);
	});

	/** Resolved background color hex */
	public bg_color = computed(() => {
		return getFacehashColor(this.colors(), this.face_data().colorIndex);
	});

	/** CSS styles for the outer container */
	public container_style = computed(() => {
		const preset = INTENSITY_PRESETS[this.intensity()];
		const styles: Record<string, string> = {
			width: this.size(),
			height: this.size(),
			'background-color': this.bg_color(),
		};
		if (this.intensity() !== 'none') {
			styles['perspective'] = preset.perspective;
		}
		return styles;
	});

	/** CSS transform for the face container (3D rotation) */
	public face_transform = computed(() => {
		const level = this.intensity();
		if (level === 'none') return 'none';
		const preset = INTENSITY_PRESETS[level];
		const {rotation} = this.face_data();
		const rotate_x = this.is_hovered() && this.interactive() ? 0 : rotation.x * preset.rotateRange;
		const rotate_y = this.is_hovered() && this.interactive() ? 0 : rotation.y * preset.rotateRange;
		return `rotateX(${rotate_x}deg) rotateY(${rotate_y}deg) translateZ(${preset.translateZ}px)`;
	});

	/** Handles mouse enter for interactive hover */
	public onMouseEnter(): void {
		if (this.interactive()) {
			this.is_hovered.set(true);
		}
	}

	/** Handles mouse leave for interactive hover */
	public onMouseLeave(): void {
		if (this.interactive()) {
			this.is_hovered.set(false);
		}
	}
}
