import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EnrollmentPage } from './enrollment.page';
import { SharedComponentsModule } from 'src/app/components/shared.components.module';

const routes: Routes = [
  {
    path: '',
    component: EnrollmentPage
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
  declarations: [EnrollmentPage]
})
export class EnrollmentPageModule {}
