/* Core Dependencies */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
/* Vendors Dependencies */
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
/* Application Dependencies */
import { FormModule } from '@client/modules/form/form.module';
/* Local Dependencies */
import { AiInputComponent } from './components/ai-input/ai-input.component';
import { AiNavComponent } from './components/ai-nav/ai-nav.component';
import { AiCommandComponent } from './components/ai-command/ai-command.component';
import { AiModelComponent } from './components/ai-model/ai-model.component';
import { AiConversationHudComponent } from './components/ai-conversation-hud/ai-conversation-hud.component';
import { AiChatLogComponent } from './components/ai-chat-log/ai-chat-log.component';
import { AiAgentComponent } from './components/ai-agent/ai-agent.component';
import { AiChatAvatarComponent } from './components/ai-chat-avatar/ai-chat-avatar.component';
import { AiChatMessageSystemComponent } from './components/ai-chat-message-system/ai-chat-message-system.component';
import { AiChatMessageUserComponent } from './components/ai-chat-message-user/ai-chat-message-user.component';
import { AiChatMessageAssistantComponent } from './components/ai-chat-message-assistant/ai-chat-message-assistant.component';

@NgModule({
	declarations: [	
		AiInputComponent,
		AiNavComponent,
		AiCommandComponent,
		AiModelComponent,
 		AiConversationHudComponent,
   		AiChatLogComponent,
		AiAgentComponent,
		AiChatAvatarComponent,
		AiChatMessageSystemComponent,
		AiChatMessageUserComponent,
		AiChatMessageAssistantComponent,
	],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatIconModule,
		MatButtonModule,
		MatMenuModule,
		FormModule,
	],
	exports: [
		AiNavComponent,
		AiChatLogComponent,
	]
})
export class AiModule { }