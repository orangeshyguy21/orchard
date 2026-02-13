export interface TreemapRect {
	x: number;
	y: number;
	width: number;
	height: number;
}

interface SizedItem {
	area: number;
}

interface Bounds {
	x: number;
	y: number;
	width: number;
	height: number;
}

/**
 * Generates a squarified treemap layout of synthetic rectangles within bounds
 */
export function generateTreemap(count: number, width: number, height: number, gap: number = 1): TreemapRect[] {
	if (count <= 0 || width <= 0 || height <= 0) return [];

	const capped = Math.min(count, 300);
	const items: SizedItem[] = [];
	let rng = count * 31 + 7;

	for (let i = 0; i < capped; i++) {
		rng = (rng * 1103515245 + 12345) & 0x7fffffff;
		const raw = (rng % 1000) / 1000;
		items.push({area: 1 / Math.pow(1 - raw * 0.95, 1.5)});
	}

	const total = items.reduce((sum, item) => sum + item.area, 0);
	const full_area = width * height;
	for (const item of items) {
		item.area = (item.area / total) * full_area;
	}

	items.sort((a, b) => b.area - a.area);

	const rects: TreemapRect[] = [];
	squarify(items, {x: 0, y: 0, width, height}, rects);

	const half_gap = gap / 2;
	for (const rect of rects) {
		rect.x += half_gap;
		rect.y += half_gap;
		rect.width = Math.max(0, rect.width - gap);
		rect.height = Math.max(0, rect.height - gap);
	}

	return rects;
}

/**
 * Recursively lays out items using the squarified treemap algorithm
 */
function squarify(items: SizedItem[], bounds: Bounds, rects: TreemapRect[]): void {
	if (items.length === 0) return;
	if (items.length === 1) {
		rects.push({x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height});
		return;
	}

	const short_side = Math.min(bounds.width, bounds.height);
	let row: SizedItem[] = [items[0]];
	let remaining = items.slice(1);
	let current_worst = worstAspectRatio(row, short_side);

	for (let i = 1; i < items.length; i++) {
		const test_row = [...row, items[i]];
		const test_worst = worstAspectRatio(test_row, short_side);

		if (test_worst <= current_worst) {
			row = test_row;
			remaining = items.slice(i + 1);
			current_worst = test_worst;
		} else {
			remaining = items.slice(i);
			break;
		}
	}

	const row_bounds = layoutRow(row, bounds, rects);
	squarify(remaining, row_bounds, rects);
}

/**
 * Calculates the worst aspect ratio for a row of items laid along a side
 */
function worstAspectRatio(row: SizedItem[], side: number): number {
	const row_area = row.reduce((sum, item) => sum + item.area, 0);
	let worst = 0;

	for (const item of row) {
		const row_width = row_area / side;
		const item_height = item.area / row_width;
		const ratio = row_width > item_height ? row_width / item_height : item_height / row_width;
		worst = Math.max(worst, ratio);
	}

	return worst;
}

/**
 * Lays out a row of items in the bounds and returns the remaining bounds
 */
function layoutRow(row: SizedItem[], bounds: Bounds, rects: TreemapRect[]): Bounds {
	const row_area = row.reduce((sum, item) => sum + item.area, 0);

	if (bounds.width >= bounds.height) {
		const row_width = row_area / bounds.height;
		let y = bounds.y;

		for (const item of row) {
			const item_height = item.area / row_width;
			rects.push({x: bounds.x, y, width: row_width, height: item_height});
			y += item_height;
		}

		return {x: bounds.x + row_width, y: bounds.y, width: bounds.width - row_width, height: bounds.height};
	} else {
		const row_height = row_area / bounds.width;
		let x = bounds.x;

		for (const item of row) {
			const item_width = item.area / row_height;
			rects.push({x, y: bounds.y, width: item_width, height: row_height});
			x += item_width;
		}

		return {x: bounds.x, y: bounds.y + row_height, width: bounds.width, height: bounds.height - row_height};
	}
}
