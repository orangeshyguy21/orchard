/* Local Dependencies */
import {UTXOracleProgress} from './utxoracle.types';

/**
 * Helper class to manage and emit progress updates during oracle computation
 */
export class UTXOracleProgressTracker {
	private callback?: (progress: UTXOracleProgress) => void;

	private readonly STAGES = {
		connecting: {range: [0, 5], name: 'connecting'},
		finding_start: {range: [5, 25], name: 'finding_start'},
		finding_end: {range: [25, 50], name: 'finding_end'},
		loading_transactions: {range: [50, 95], name: 'loading_transactions'},
		computing_prices: {range: [95, 100], name: 'computing_prices'},
	} as const;

	constructor(callback?: (progress: UTXOracleProgress) => void) {
		this.callback = callback;
	}

	/**
	 * Emit progress for a stage
	 */
	public emit(stage: keyof typeof this.STAGES, stage_progress: number, message?: string): void {
		if (!this.callback) return;
		const stage_def = this.STAGES[stage];
		const [start, end] = stage_def.range;
		const total_progress = start + (stage_progress / 100) * (end - start);
		this.callback({
			stage,
			stage_progress,
			total_progress: Math.min(100, Math.max(0, total_progress)),
			message,
		});
	}

	/**
	 * Create a connection phase tracker that increments through RPC calls
	 */
	public createConnectionTracker(): () => void {
		const steps = [
			{progress: 0, message: 'Connecting to node...'},
			{progress: 20, message: 'Validating RPC credentials...'},
			{progress: 40, message: 'Getting block count...'},
			{progress: 60, message: 'Getting consensus tip hash...'},
			{progress: 80, message: 'Getting block header...'},
			{progress: 100, message: 'Connected to node'},
		];

		let current_step = 0;

		return () => {
			if (current_step < steps.length) {
				const step = steps[current_step];
				this.emit('connecting', step.progress, step.message);
				current_step++;
			}
		};
	}

	/**
	 * Create a sub-tracker for iterating through blocks with automatic progress
	 */
	public createBlockIterator(
		stage: keyof typeof this.STAGES,
		start_block: number,
		end_block: number,
		message_template: string,
		progress_offset: number = 0, // within stage, 0-100
		progress_range: number = 100, // how much of stage this takes up
	): (current_block: number) => void {
		const total_blocks = end_block - start_block + 1;
		return (current_block: number) => {
			const blocks_processed = current_block - start_block + 1;
			const iterator_progress = (blocks_processed / total_blocks) * 100;
			const stage_progress = progress_offset + (iterator_progress / 100) * progress_range;
			const message = message_template
				.replace('{height}', current_block.toString())
				.replace('{current}', blocks_processed.toString())
				.replace('{total}', total_blocks.toString());
			this.emit(stage, stage_progress, message);
		};
	}

	/**
	 * Create a sub-tracker for binary search with automatic progress
	 */
	public createSearchIterator(stage: keyof typeof this.STAGES, max_iterations: number, message: string): () => void {
		let call_count = 0;
		return () => {
			call_count++;
			const stage_progress = Math.min(100, (call_count / max_iterations) * 100);
			this.emit(stage, stage_progress, message);
		};
	}
}
