/* Core Dependencies */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
/* Vendor Dependencies */
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
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
		MatCardModule,
		MatIconModule,
		IndexAppRoutingModule,
	],
})
export class IndexAppModule { }