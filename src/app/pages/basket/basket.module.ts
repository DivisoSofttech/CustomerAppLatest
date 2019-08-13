import { CartComponent } from './../../components/cart/cart.component';
import { ComponentsModule } from './../../components/components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BasketPage } from './basket.page';

const routes: Routes = [
  {
    path: '',
    component: BasketPage
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
  declarations: [BasketPage],
  entryComponents: [CartComponent]
})
export class BasketPageModule {}
