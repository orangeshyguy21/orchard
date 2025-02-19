/* Core Dependencies */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/* Vendor Dependencies */
import { MatCardModule } from '@angular/material/card';
/* Local Dependencies */
import { PrimaryNavComponent } from '@client/modules/nav/components/primary/primary-nav.component';

@NgModule({
  declarations: [
    PrimaryNavComponent
  ],
  imports: [
    CommonModule,
    MatCardModule
  ],
  exports: [
    PrimaryNavComponent
  ]
})
export class NavModule { }