/* Core Dependencies */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
/* Local Dependencies */
import { LightningSectionComponent } from './components/lightning-section/lightning-section.component';

const routes: Routes = [
  {
    path: '',
    component: LightningSectionComponent,
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
export class LightningAppRoutingModule { }


@NgModule({
  declarations: [
    LightningSectionComponent
  ],
  imports: [
    CommonModule,
    LightningAppRoutingModule,
  ],

})
export class LightningAppModule { }