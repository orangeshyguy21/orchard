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

@NgModule({
	declarations: [	
		AiInputComponent,
		AiNavComponent,
		AiCommandComponent,
		AiModelComponent,
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
	]
})
export class AiModule { }