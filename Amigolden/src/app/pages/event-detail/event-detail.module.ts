import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { EventDetailPage } from './event-detail.page';
import { SharedComponentsModule } from 'src/app/components/shared.components.module';

const routes: Routes = [
  {
    path: '',
    component: EventDetailPage
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
  declarations: [EventDetailPage]
})
export class EventDetailPageModule {}
