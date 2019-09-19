import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { UserDetailPage } from './user-detail.page';
import { SharedComponentsModule } from 'src/app/components/shared.components.module';

const routes: Routes = [
  {
    path: '',
    component: UserDetailPage
  }
];

@NgModule({
  imports: [
    SharedComponentsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [UserDetailPage]
})
export class UserDetailPageModule {}
