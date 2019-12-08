import { CartComponent } from './../../components/cart/cart.component';
import { ComponentsModule } from './../../components/components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BasketPage } from './basket.page';
import { DirectiveModule } from 'src/app/directives/directive.module';

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
    DirectiveModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BasketPage],
  entryComponents: [CartComponent]
})
export class BasketPageModule {}
