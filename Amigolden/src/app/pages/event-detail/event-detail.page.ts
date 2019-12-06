import { Component, OnInit } from '@angular/core';
import { CardInfo, TransactionOptions } from 'src/app/models/transactions-info';
import { StripePaymentsService } from 'src/app/services/endpoints/stripe-payments.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService } from 'src/app/services/endpoints/events.service';
import { Meeting } from 'src/app/models/meetings';
import { Identity } from 'src/app/services/identity/identity.service';
import { EditOptions } from 'src/app/models/edit-options';
import { ModalController } from '@ionic/angular';
import { MapComponent } from 'src/app/components/map/map.component';
import { MapOptions } from 'src/app/models/map/map-options';
import { Location } from 'src/app/models/location';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
})
// TODO: this should probably inherit from DetailPageBase when we support event creation
export class EventDetailPage implements OnInit {

  entityId: number = null;
  entity: Meeting;

  editOptions: EditOptions = {
    isEditing: false,
    canEdit: false,
    // TODO: use this.save() when once inherited from DetailPageBase
    save: () => {}
  };

  constructor(protected eventService: EventsService,
              protected route: ActivatedRoute, protected router: Router, protected identity: Identity,
              protected  modalController: ModalController) {
    this.route.queryParams.subscribe(params => {
      this.entityId = this.entity.id;
    });

    if (this.router.getCurrentNavigation().extras.state) {
      this.entity = this.router.getCurrentNavigation().extras.state.entity;
    }


    this.identity.getCurrentUser().then((u) => { this.editOptions.canEdit = this.entityId === u.id; });
  }

  ngOnInit() {
  }


  async pickALocationModal() {
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
