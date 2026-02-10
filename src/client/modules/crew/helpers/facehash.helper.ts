/** Face eye shape types */
export type FaceType = 'round' | 'cross' | 'line' | 'curved';

/** 3D rotation intensity presets */
export type Intensity3D = 'none' | 'subtle' | 'medium' | 'dramatic';

/** Background style variant */
export type FacehashVariant = 'gradient' | 'solid';

/** Computed facehash data derived from a name string */
export interface FacehashData {
	faceType: FaceType;
	colorIndex: number;
	rotation: {x: number; y: number};
	initial: string;
	blinkDelay: number;
	blinkDuration: number;
}

/** Intensity preset configuration */
export interface IntensityPreset {
	rotateRange: number;
	translateZ: number;
	perspective: string;
}

/** Default facehash color palette */
export const FACEHASH_COLORS: readonly string[] = [
	'#ec4899', // pink
	'#f59e0b', // amber
	'#3b82f6', // blue
	'#f97316', // orange
	'#10b981', // emerald
] as const;

const FACE_TYPES: readonly FaceType[] = ['round', 'cross', 'line', 'curved'] as const;

const SPHERE_POSITIONS: readonly {x: number; y: number}[] = [
	{x: -1, y: 1},
	{x: 1, y: 1},
	{x: 1, y: 0},
	{x: 0, y: 1},
	{x: -1, y: 0},
	{x: 0, y: 0},
	{x: 0, y: -1},
	{x: -1, y: -1},
	{x: 1, y: -1},
] as const;

export const INTENSITY_PRESETS: Record<Intensity3D, IntensityPreset> = {
	none: {rotateRange: 0, translateZ: 0, perspective: 'none'},
	subtle: {rotateRange: 5, translateZ: 4, perspective: '800px'},
	medium: {rotateRange: 10, translateZ: 8, perspective: '500px'},
	dramatic: {rotateRange: 15, translateZ: 12, perspective: '300px'},
};

/**
 * DJB2-like string hash producing a positive 32-bit integer.
 * Same input always produces the same output.
 */
export function stringHash(str: string): number {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash &= hash;
	}
	return Math.abs(hash);
}

/**
 * Computes deterministic face properties from a name string.
 * The same name always produces the same face type, color, rotation, and initial.
 */
export function computeFacehash(name: string, colors_length: number = FACEHASH_COLORS.length): FacehashData {
	const hash = stringHash(name);
	const face_index = hash % FACE_TYPES.length;
	const color_index = hash % colors_length;
	const position_index = hash % SPHERE_POSITIONS.length;
	const position = SPHERE_POSITIONS[position_index] ?? {x: 0, y: 0};

	const blink_seed = hash * 31;
	const blink_delay = (blink_seed % 40) / 10;
	const blink_duration = 2 + (blink_seed % 40) / 10;

	return {
		faceType: FACE_TYPES[face_index] ?? 'round',
		colorIndex: color_index,
		rotation: position,
		initial: name.charAt(0).toUpperCase(),
		blinkDelay: blink_delay,
		blinkDuration: blink_duration,
	};
}

/**
 * Resolves a color from the palette by index, with wrapping and fallback.
 */
export function getFacehashColor(colors: readonly string[] | undefined, index: number): string {
	const palette = colors && colors.length > 0 ? colors : FACEHASH_COLORS;
	return palette[index % palette.length] ?? '#ec4899';
}
