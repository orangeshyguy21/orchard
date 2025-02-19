/* Core Dependencies */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/* Vendor Dependencies */
import { MatIconModule } from '@angular/material/icon';
/* Application Dependencies */
import { GraphicModule } from '@client/modules/graphic/graphic.module';
/* Local Dependencies */
import { PrimaryNavComponent } from '@client/modules/nav/components/primary-nav/primary-nav.component';
import { PrimaryNavHeaderComponent } from './components/primary-nav-header/primary-nav-header.component';
import { PrimaryNavItemsComponent } from './components/primary-nav-items/primary-nav-items.component';
import { PrimaryNavItemComponent } from './components/primary-nav-item/primary-nav-item.component';

@NgModule({
  declarations: [
    PrimaryNavComponent,
    PrimaryNavHeaderComponent,
    PrimaryNavItemsComponent,
    PrimaryNavItemComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    GraphicModule,
  ],
  exports: [
    PrimaryNavComponent
  ]
})
export class NavModule { }