/* Core Dependencies */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
/* Vendor Dependencies */
import { MatIconModule } from '@angular/material/icon';
/* Native Dependencies */
import { EventSectionComponent } from './components/event-section/event-section.component';

const routes: Routes = [
	{
		path: '',
		component: EventSectionComponent,
		title: 'Orchard | Event Log',
		data: {
			section: 'event',
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
export class EventAppRoutingModule { }


@NgModule({
	declarations: [
  		EventSectionComponent
	],
	imports: [
		CommonModule,
		MatIconModule,
		EventAppRoutingModule
	],
	exports: []
})
export class EventAppModule { }