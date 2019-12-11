import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { EventsService } from 'src/app/services/endpoints/events.service';
import { Meeting, EventType } from 'src/app/models/meetings';
import { Identity } from 'src/app/services/identity/identity.service';
import { EditOptions } from 'src/app/models/edit-options';
import { ModalController } from '@ionic/angular';
import { MapComponent } from 'src/app/components/map/map.component';
import { MapOptions } from 'src/app/models/map/map-options';
import { Location } from 'src/app/models/location';
import { EnrollmentPage } from '../enrollment/enrollment.page';
import { RouteNames } from 'src/app/app-routing.module';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
})
// TODO: this should probably inherit from DetailPageBase when we support event creation
export class EventDetailPage implements OnInit {

  entityId: number = null;
  entity: Meeting;
  isEnrolled = false;
  isCurrentUserOwner = false;

  editOptions: EditOptions = {
    isEditing: false,
    canEdit: false,
    // TODO: use this.save() when once inherited from DetailPageBase
    save: () => {}
  };

  constructor(protected eventService: EventsService,
              protected route: ActivatedRoute, protected router: Router, protected identity: Identity,
              protected  modalController: ModalController) {
    this.entityId = +this.route.snapshot.paramMap.get('id');

    if (this.router.getCurrentNavigation().extras.state) {
      this.entity = this.router.getCurrentNavigation().extras.state.entity;
    } else if (!this.entity) {
      eventService.get(this.entityId).subscribe(entity => this.entity = entity);
    }

    this.eventService.isEnrolled(this.entityId).subscribe(isEnrolled => this.isEnrolled = isEnrolled);

    this.identity.getCurrentUser().then((u) => {
      this.isCurrentUserOwner = this.entityId === u.id;
      this.editOptions.canEdit = this.isCurrentUserOwner;
    });

  }

  ngOnInit() {
  }

  navigateToEnrollments() {
    const navigationExtras: NavigationExtras = { state: { entity: this.entity } };
    this.router.navigate([RouteNames.enrollmentDetail, this.entity.id], navigationExtras);
  }

  isEventActive() {
    return true;
    return this.addDays(this.entity.meetTime, 1) >= new Date();
  }

  addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  canEnroll() {
    return this.entityId
      && !this.isCurrentUserOwner
      && !this.isEnrolled
      && this.isEventActive();
  }

  isVoteBased() {
    return this.entityId
      && !this.isCurrentUserOwner
      && this.isEnrolled
      && this.entity
      && this.entity.eventType === EventType.Vote;
  }

  async openVoteModal() {
    console.log('opening vote modal');
  }

  async openLocationPickerModal() {
    const modal = await this.modalController.create({
      component: MapComponent,
       componentProps: { // <----------
        options: new MapOptions<Location>('Select', true, true, (lat, lon) => null, x => x)
      }
    });
    return await modal.present();
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
