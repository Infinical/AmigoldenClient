import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UsersListPage } from './users-list.page';
import { ListBaseComponent } from 'src/app/components/list-base/list-base.component';
import { SharedComponentsModule } from 'src/app/components/shared.components.module';

const routes: Routes = [
  {
    path: '',
    component: UsersListPage
  }
];

@NgModule({
  imports: [
    // SharedComponentsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UsersListPage, ListBaseComponent]
})
export class UsersListPageModule {}
