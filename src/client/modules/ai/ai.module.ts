/* Core Dependencies */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/* Local Dependencies */
import { AiInputComponent } from './components/ai-input/ai-input.component';

@NgModule({
	declarations: [	
		AiInputComponent
	],
	imports: [
		CommonModule,
	],
	exports: [
		AiInputComponent
	]
})
export class AiModule { }