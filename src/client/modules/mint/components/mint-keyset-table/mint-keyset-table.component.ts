import { ChangeDetectionStrategy, Component } from '@angular/core';

export interface PeriodicElement {
	name: string;
	position: number;
	weight: number;
	symbol: string;
  }
  
  const ELEMENT_DATA: PeriodicElement[] = [
	{position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
	{position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
	{position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
	{position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
	{position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
	{position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
	{position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
	{position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
	{position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
	{position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  ];

@Component({
	selector: 'orc-mint-keyset-table',
	standalone: false,
	templateUrl: './mint-keyset-table.component.html',
	styleUrl: './mint-keyset-table.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintKeysetTableComponent {

	displayedColumns = ['position', 'name', 'weight', 'symbol'];
  	dataSource = ELEMENT_DATA;

}
