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

  hasExistingCard = false;
  platformAmount = environment.eventCosts.platform;
  entityId: number = null;
  entity: Meeting;

  editOptions: EditOptions = {
    isEditing: false,
    canEdit: false,
    // TODO: use this.save() when once inherited from DetailPageBase
    save: () => {}
  };

  constructor(protected stripePayments: StripePaymentsService, protected eventService: EventsService,
              protected route: ActivatedRoute, protected router: Router, protected identity: Identity,
              protected  modalController: ModalController) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.entity = this.router.getCurrentNavigation().extras.state.entity;
        this.entityId = this.entity.id;
      }
    });

    this.identity.getCurrentUser().then((u) => { this.editOptions.canEdit = this.entityId === u.id; });
  }

  ngOnInit() {
  }

  onTokenReceived(stripeTokenResponse: any) {

    const cardInfo = new CardInfo();
    cardInfo.token = stripeTokenResponse.id;
    cardInfo.paymentMethodId = stripeTokenResponse.card.id;
    cardInfo.last4 = stripeTokenResponse.card.last4;
    cardInfo.zip = stripeTokenResponse.card.address_zip;
    cardInfo.expirationYear = stripeTokenResponse.card.exp_year;
    cardInfo.expirationMonth = stripeTokenResponse.card.exp_month;
    this.stripePayments.createCustomer(cardInfo).subscribe(_ => this.hasExistingCard = true);
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

  enroll() {
    const transactionOptions = new TransactionOptions();

    // TODO: the amount should not be hardcoded
    transactionOptions.amountInCents = this.platformAmount;
    transactionOptions.meetingId = this.entityId;
    // TODO: Don't rely on the server to ignore duplicate transactions
    this.stripePayments.authorizeTransaction(transactionOptions).subscribe(t => {
      this.eventService.enroll(this.entityId).subscribe(r => {
          if (!r) {
            console.log('User is already enrolled');
          }

          // TODO: should we navigate to meeting or should we just change the view state of the current page
          // this.navigateToMeeting(this.meetingId);
      });
    });
  }
}
