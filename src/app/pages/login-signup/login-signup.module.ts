import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LoginSignupPage } from './login-signup.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { LoginSignupComponent } from 'src/app/components/login-signup/login-signup.component';

const routes: Routes = [
  {
    path: '',
    component: LoginSignupPage
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
  declarations: [LoginSignupPage],
  entryComponents: [LoginSignupComponent]
})
export class LoginSignupPageModule {}
