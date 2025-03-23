/* Core Dependencies */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/* Vendor Dependencies */
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
/* Local Dependencies */
import { ErrorResolveComponent } from './components/error-resolve/error-resolve.component';

@NgModule({
	declarations: [	
        ErrorResolveComponent
    ],
	imports: [
		CommonModule,
		MatIconModule,
		MatCardModule,
	],
	exports: [
		ErrorResolveComponent
	]
})
export class ErrorModule { }