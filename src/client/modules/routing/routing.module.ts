/* Core Dependencies */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/* Local Dependencies */
import { LayoutExteriorComponent } from './components/layout-exterior/layout-exterior.component';
import { LayoutInteriorComponent } from './components/layout-interior/layout-interior.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutInteriorComponent,
    loadChildren: () => import('../mint/mint.module').then(m => m.MintModule)
  },
  {
    path: 'login',
    component: LayoutExteriorComponent,
    loadChildren: () => import('../login/login.module').then(m => m.LoginModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: [
    LayoutExteriorComponent,
    LayoutInteriorComponent
  ]
})
export class RoutingModule { }