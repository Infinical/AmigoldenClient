import { Component, OnInit } from '@angular/core';
import { CardInfo, TransactionOptions } from 'src/app/models/transactions-info';
import { environment } from 'src/environments/environment';
import { StripePaymentsService } from 'src/app/services/endpoints/stripe-payments.service';
import { EventsService } from 'src/app/services/endpoints/events.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Meeting } from 'src/app/models/meetings';
import { EntityPageBase } from '../detail-page-base';

@Component({
  selector: 'app-enrollment',
  templateUrl: './enrollment.page.html',
  styleUrls: ['./enrollment.page.scss'],
})
export class EnrollmentPage extends EntityPageBase<Meeting> implements OnInit {

  hasExistingCard = false;
  entityId: number;
  entity: Meeting;
  eventCostInCents: number;

  constructor(protected stripePayments: StripePaymentsService,
              protected eventService: EventsService,
              protected route: ActivatedRoute,
              protected router: Router) {
    super(route, router, eventService);
  }

  ngOnInit() {
    this.eventService.getDefaultEventCost(this.entityId).subscribe(eventCost => this.eventCostInCents = eventCost);
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

  enroll(eventCostInCents) {
    const transactionOptions = new TransactionOptions();

    // TODO: the amount should not be hardcoded
    transactionOptions.amountInCents = eventCostInCents;
    transactionOptions.meetingId = this.entityId;
    // TODO: Don't rely on the server to ignore duplicate transactions
    this.stripePayments.authorizeTransaction(transactionOptions).subscribe(t => {
      this.eventService.enroll(this.entityId).subscribe(r => {
          if (!r) {
            console.log('User is already enrolled');
          }
      });
    });
  }
}
