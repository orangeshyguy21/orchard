/* Core Dependencies */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
/* Application Dependencies */
import { NavModule } from '@client/modules/nav/nav.module';
/* Native Module Dependencies */
import { SettingsSectionComponent } from './components/settings-section/settings-section.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsSectionComponent,
    title: 'Orchard | Settings',
    data: {
      section: 'settings',
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
export class SettingsRoutingModule { }


@NgModule({
  declarations: [
    SettingsSectionComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    NavModule,
  ],

})
export class SettingsModule { }