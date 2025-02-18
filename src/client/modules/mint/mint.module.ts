/* Core Dependencies */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
/* Vendor Dependencies */
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
/* Local Dependencies */
import { MintComponent } from './components/mint/mint.component';

const routes: Routes = [
  {
    path: '',
    component: MintComponent,
    title: 'Orchard | Mint'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ]
})
export class MintRoutingModule { }


@NgModule({
  declarations: [
    MintComponent
  ],
  imports: [
    CommonModule,
    MintRoutingModule,
    MatIconModule,
    MatButtonModule,
  ],

})
export class MintModule { }