import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MessagesListPage } from './messages-list.page';
import { SharedComponentsModule } from 'src/app/components/shared.components.module';

const routes: Routes = [
  {
    path: '',
    component: MessagesListPage
  }
];

@NgModule({
  imports: [
    SharedComponentsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MessagesListPage]
})
export class MessagesListPageModule {}
