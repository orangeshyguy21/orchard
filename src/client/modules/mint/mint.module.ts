/* Core Dependencies */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/* Local Dependencies */
import { MintComponent } from './components/mint/mint.component';

const routes: Routes = [
  {
    path: '',
    component: MintComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MintRoutingModule { }

@NgModule({
  imports: [
    MintRoutingModule
  ],
})
export class MintModule { }