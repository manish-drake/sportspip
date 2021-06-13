import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartModule } from 'app/main/charts-and-maps/charts/charts.module';
import { GoogleMapModule } from 'app/main/charts-and-maps/google-maps/google-maps.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, ChartModule, GoogleMapModule], 
  exports: []
})
export class ChartsAndMapsModule {}
