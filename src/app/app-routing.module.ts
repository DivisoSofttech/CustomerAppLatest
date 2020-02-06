import { AuthGuardService } from './services/security/auth-guard.service';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { SlidesComponent } from './components/slides/slides.component';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'restaurant',
    pathMatch: 'full',
  },

  { path: 'login', loadChildren: './pages/login-signup/login-signup.module#LoginSignupPageModule'},
  { path: 'restaurant', loadChildren: './pages/restaurant/restaurant.module#RestaurantPageModule' , canActivate: [AuthGuardService]},
  { path: 'store/:id', loadChildren: './pages/store/store.module#StorePageModule' , canActivate: [AuthGuardService]},
  { path: 'store/search/:idpcode/:type/:tid/:cid', loadChildren: './pages/store/store.module#StorePageModule' , canActivate: [AuthGuardService]},
  { path: 'store/search/:idpcode/:type/:cid', loadChildren: './pages/store/store.module#StorePageModule' , canActivate: [AuthGuardService]},
  { path: 'basket', loadChildren: './pages/basket/basket.module#BasketPageModule' , canActivate: [AuthGuardService]},
  { path: 'profile', loadChildren: './pages/profile/profile.module#ProfilePageModule' , canActivate: [AuthGuardService]},
  { path: 'checkout', component: CheckoutComponent , canActivate: [AuthGuardService]},
  { path: 'slides', component: SlidesComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
