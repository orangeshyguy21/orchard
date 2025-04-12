/* Core Dependencies */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
/* Local Dependencies */
import { EcashSectionComponent } from './components/ecash-section/ecash-section.component';

const routes: Routes = [
	{
		path: '',
		component: EcashSectionComponent,
		title: 'Orchard | Ecash',
		data: {
			section: 'ecash',
			sub_section: 'dashboard'
		}
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(routes),
	],
	exports: [
		RouterModule,
	],
})
export class EcashAppRoutingModule { }


@NgModule({
	declarations: [
		EcashSectionComponent
	],
	imports: [
		CommonModule,
		EcashAppRoutingModule,
	],
})
export class EcashAppModule { }