import { FilterComponent } from './../../components/filter/filter.component';
import { BannerComponent } from './../../components/banner/banner.component';
import { HeaderComponent } from './../../components/header/header.component';
import { ComponentsModule } from './../../components/components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RestaurantPage } from './restaurant.page';
import { RestaurantCardComponent } from 'src/app/components/restaurant-card/restaurant-card.component';
import { LoadingComponent } from 'src/app/components/loading/loading.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { MapComponent } from 'src/app/components/map/map.component';

const routes: Routes = [
  {
    path: '',
    component: RestaurantPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RestaurantPage],
  entryComponents: [HeaderComponent ,     FooterComponent, BannerComponent , RestaurantCardComponent , 
    FilterComponent, LoadingComponent,   MapComponent]
})
export class RestaurantPageModule {}
