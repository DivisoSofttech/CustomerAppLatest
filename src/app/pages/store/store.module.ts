import { CartComponent } from './../../components/cart/cart.component';
import { ReviewComponent } from './../../components/review/review.component';
import { StoreHeaderComponent } from './../../components/store-header/store-header.component';
import { ProductCardComponent } from './../../components/product-card/product-card.component';
import { ComponentsModule } from './../../components/components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { StorePage } from './store.page';
import { RestaurantCardComponent } from 'src/app/components/restaurant-card/restaurant-card.component';
import { HotelMenuPopoverComponent } from 'src/app/components/hotel-menu-popover/hotel-menu-popover.component';
import { LoadingComponent } from 'src/app/components/loading/loading.component';
import { CategoryWiseProductsCardComponent } from 'src/app/components/category-wise-products-card/category-wise-products-card.component';
import { DirectiveModule } from 'src/app/directives/directive.module';
import { ClosedPipe } from 'src/app/pipes/closed.pipe';

const routes: Routes = [
  {
    path: '',
    component: StorePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    DirectiveModule,
    RouterModule.forChild(routes)
  ],
  declarations: [StorePage],
  providers:[ClosedPipe],
  entryComponents: [StoreHeaderComponent, RestaurantCardComponent , 
                    ProductCardComponent , ReviewComponent,
                    CartComponent, HotelMenuPopoverComponent,LoadingComponent,
                    CategoryWiseProductsCardComponent
                  ]
})
export class StorePageModule {}
