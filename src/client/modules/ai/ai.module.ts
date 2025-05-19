/* Core Dependencies */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
/* Vendors Dependencies */
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
/* Application Dependencies */
import { FormModule } from '@client/modules/form/form.module';
/* Local Dependencies */
import { AiInputComponent } from './components/ai-input/ai-input.component';
import { AiNavComponent } from './components/ai-nav/ai-nav.component';
import { BytesPipe } from './pipes/bytes/bytes.pipe';

@NgModule({
	declarations: [	
		AiInputComponent,
		AiNavComponent,
		BytesPipe,
	],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatIconModule,
		MatButtonModule,
		FormModule,
	],
	exports: [
		AiNavComponent,
		BytesPipe,
	]
})
export class AiModule { }