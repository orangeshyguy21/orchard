/* Core Dependencies */
import {ChangeDetectionStrategy, Component, computed, Input} from '@angular/core';
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
	@Input() public role!: AiMessageRole;
	@Input() public icon!: string | null;
	@Input() public section!: string | null;

	private readonly map_role_class = {
		[AiMessageRole.Assistant]: 'avatar-role-assistant',
		[AiMessageRole.User]: 'avatar-role-user',
		[AiMessageRole.System]: 'avatar-role-system',
		[AiMessageRole.Function]: 'avatar-role-function',
	};

	public role_class = computed(() => {
		return this.map_role_class[this.role];
	});
}
