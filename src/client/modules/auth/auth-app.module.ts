/* Core Dependencies */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
/* Vendor Dependencies */
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
/* Application Dependencies */
import { FormModule } from '@client/modules/form/form.module';
/* Local Dependencies */
import { AuthSectionComponent } from './components/auth-section/auth-section.component';
import { AuthPasswordComponent } from './components/auth-password/auth-password.component';

const routes: Routes = [
	{
		path: '',
		component: AuthSectionComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
	declarations: []
})
export class AuthAppRoutingModule { }

@NgModule({
	declarations: [
		AuthSectionComponent,
		AuthPasswordComponent
	],
	imports: [
		AuthAppRoutingModule,
		CommonModule,
		ReactiveFormsModule,
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		FormModule,
	],
})
export class AuthAppModule { }