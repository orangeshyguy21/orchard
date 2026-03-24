/* Core Dependencies */
import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
/* Vendor Dependencies */
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {marked} from 'marked';
/* Application Dependencies */
import {AiService} from '@client/modules/ai/services/ai/ai.service';

@Component({
	selector: 'orc-settings-subsection-app-ai-job-execute-dialog',
	standalone: false,
	templateUrl: './settings-subsection-app-ai-job-execute-dialog.component.html',
	styleUrl: './settings-subsection-app-ai-job-execute-dialog.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsSubsectionAppAiJobExecuteDialogComponent implements OnInit {
	// ── Injected dependencies ──
	private readonly aiService = inject(AiService);
	private readonly destroyRef = inject(DestroyRef);
	public readonly data: {id: string; name: string} = inject(MAT_DIALOG_DATA);

	// ── Public signals ──
	public readonly loading = signal<boolean>(true);
	public readonly error = signal<string | null>(null);
	public readonly marked_result = signal<string | null>(null);

	// ── Lifecycle: Init ──
	ngOnInit(): void {
		this.aiService
			.executeAiAgent(this.data.id)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (run) => {
					if (run.error) {
						this.error.set(run.error);
						this.loading.set(false);
					} else if (run.result) {
						this.parseResult(run.result);
					} else {
						this.loading.set(false);
					}
				},
				error: (err) => {
					this.error.set(err?.message ?? 'An unexpected error occurred');
					this.loading.set(false);
				},
			});
	}

	/* *******************************************************
		Helpers
	******************************************************** */

	/** Parses markdown result and updates signals */
	private async parseResult(result: string): Promise<void> {
		try {
			const parsed = await marked.parse(result);
			this.marked_result.set(parsed);
		} catch {
			this.error.set('Failed to parse result');
		}
		this.loading.set(false);
	}
}
