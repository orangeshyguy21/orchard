/* Core Dependencies */
import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
/* Shared Dependencies */
import {AiMessageRole} from '@shared/generated.types';

@Component({
	selector: 'orc-ai-chat-avatar',
	standalone: false,
	templateUrl: './ai-chat-avatar.component.html',
	styleUrl: './ai-chat-avatar.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiChatAvatarComponent {
	public role = input.required<AiMessageRole>();
	public icon = input<string | null>();
	public section = input<string | null>();

	private readonly map_role_class = {
		[AiMessageRole.Assistant]: 'avatar-role-assistant',
		[AiMessageRole.User]: 'avatar-role-user',
		[AiMessageRole.System]: 'avatar-role-system',
		[AiMessageRole.Function]: 'avatar-role-function',
		[AiMessageRole.Error]: 'avatar-role-error',
	};

	public role_class = computed(() => {
		return this.map_role_class[this.role()];
	});
}
