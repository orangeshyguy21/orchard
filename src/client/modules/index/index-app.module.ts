/* Core Dependencies */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
/* Local Dependencies */
import { IndexSectionComponent } from './components/index-section/index-section.component';

const routes: Routes = [
	{
		path: '',
		component: IndexSectionComponent,
		title: 'Orchard',
		data: {
			section: 'index',
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
export class IndexAppRoutingModule { }


@NgModule({
	declarations: [
		IndexSectionComponent,
	],
	imports: [
		CommonModule,
		IndexAppRoutingModule,
	],
})
export class IndexAppModule { }