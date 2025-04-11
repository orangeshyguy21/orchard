/* Core Dependencies */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/* Local Dependencies */
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
	{
		path: '',
		component: LoginComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class LoginAppRoutingModule { }

@NgModule({
	imports: [
		LoginAppRoutingModule
	],
})
export class LoginAppModule { }