/* Core Dependencies */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/* Application Dependencies */
import { NavModule } from '@client/modules/nav/nav.module';
/* Local Dependencies */
import { LayoutExteriorComponent } from './components/layout-exterior/layout-exterior.component';
import { LayoutInteriorComponent } from './components/layout-interior/layout-interior.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'mint', // temporary redirect to mint (working here first)
    pathMatch: 'full'
  },
  {
    path: 'mint',
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
  imports: [
    RouterModule.forRoot(routes),
    NavModule
  ],
  exports: [
    RouterModule
  ],
  declarations: [
    LayoutExteriorComponent,
    LayoutInteriorComponent
  ]
})
export class RoutingModule { }