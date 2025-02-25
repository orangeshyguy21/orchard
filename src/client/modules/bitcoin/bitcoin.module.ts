/* Core Dependencies */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
/* Local Dependencies */
import { BitcoinSectionComponent } from './components/bitcoin-section/bitcoin-section.component';

const routes: Routes = [
	{
		path: '',
		component: BitcoinSectionComponent,
		title: 'Orchard | Bitcoin',
		data: {
			section: 'bitcoin',
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
export class BitcoinRoutingModule { }


@NgModule({
	declarations: [
		BitcoinSectionComponent
	],
	imports: [
		CommonModule,
		BitcoinRoutingModule,
	],
})
export class BitcoinModule { }