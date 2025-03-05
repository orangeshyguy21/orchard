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
export class IndexRoutingModule { }


@NgModule({
	declarations: [
		IndexSectionComponent,
	],
	imports: [
		CommonModule,
		IndexRoutingModule,
	],
})
export class IndexModule { }