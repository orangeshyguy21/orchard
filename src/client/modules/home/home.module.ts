/* Core Dependencies */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/* Application Components */
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  }
];

console.log('HOME LOADED');

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
class HomeRoutingModule { }

@NgModule({
  imports: [
    HomeRoutingModule
  ],
})
export class HomeModule { }