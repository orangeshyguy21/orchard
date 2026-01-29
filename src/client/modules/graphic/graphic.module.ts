/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
/* Vendor Dependencies */
import {MatIconModule} from '@angular/material/icon';
/* Native Module Dependencies */
import {GraphicOrchardLogoComponent} from './components/graphic-orchard-logo/graphic-orchard-logo.component';
import {GraphicAssetComponent} from './components/graphic-asset/graphic-asset.component';
import {GraphicOracleComponent} from './components/graphic-oracle/graphic-oracle.component';
import {GraphicOracleIconComponent} from './components/graphic-oracle-icon/graphic-oracle-icon.component';

@NgModule({
	declarations: [GraphicOrchardLogoComponent, GraphicAssetComponent, GraphicOracleComponent, GraphicOracleIconComponent],
	imports: [CommonModule, MatIconModule],
	exports: [GraphicOrchardLogoComponent, GraphicAssetComponent, GraphicOracleComponent, GraphicOracleIconComponent],
})
export class OrcGraphicModule {}
