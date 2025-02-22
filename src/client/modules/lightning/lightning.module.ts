/* Core Dependencies */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
/* Vendor Dependencies */
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
/* Local Dependencies */
import { LightningComponent } from './components/lightning/lightning.component';

const routes: Routes = [
  {
    path: '',
    component: LightningComponent,
    title: 'Orchard | Lightning',
    data: {
      section: 'lightning',
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
export class LightningRoutingModule { }


@NgModule({
  declarations: [
    LightningComponent
  ],
  imports: [
    CommonModule,
    LightningRoutingModule,
    MatIconModule,
    MatButtonModule,
  ],

})
export class LightningModule { }