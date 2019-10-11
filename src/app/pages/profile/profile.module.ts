import { HistoryListComponent } from './../../components/history-list/history-list.component';
import { FavouriteListComponent } from './../../components/favourite-list/favourite-list.component';
import { FrequentlyOrderedListComponent } from './../../components/frequently-ordered-list/frequently-ordered-list.component';
import { ComponentsModule } from './../../components/components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProfilePage } from './profile.page';
import { ProfileInfoComponent } from 'src/app/components/profile-info/profile-info.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { DirectiveModule } from 'src/app/directives/directive.module';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage
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
  declarations: [ProfilePage],
  entryComponents: [ProfileInfoComponent,FrequentlyOrderedListComponent,FavouriteListComponent,
  HistoryListComponent,FooterComponent]
})
export class ProfilePageModule {}
