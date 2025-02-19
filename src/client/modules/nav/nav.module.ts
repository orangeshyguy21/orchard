/* Core Dependencies */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/* Application Dependencies */
import { GraphicModule } from '@client/modules/graphic/graphic.module';
/* Local Dependencies */
import { PrimaryNavComponent } from '@client/modules/nav/components/primary-nav/primary-nav.component';

@NgModule({
  declarations: [
    PrimaryNavComponent
  ],
  imports: [
    CommonModule,
    GraphicModule,
  ],
  exports: [
    PrimaryNavComponent
  ]
})
export class NavModule { }