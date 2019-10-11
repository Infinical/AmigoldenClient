import { Component, OnInit } from '@angular/core';
import { CardInfo, TransactionOptions } from 'src/app/models/transactions-info';
import { StripePaymentsService } from 'src/app/services/endpoints/stripe-payments.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService } from 'src/app/services/endpoints/events.service';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
})
// TODO: this should probably inherit from DetailPageBase when we support event creation
export class EventDetailPage implements OnInit {

  hasExistingCard = false;
  platformAmount = environment.eventCosts.platform;
  meetingId = 0;

  constructor(protected stripePayments: StripePaymentsService, protected eventService: EventsService,
              protected route: ActivatedRoute, protected router: Router) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.meetingId = this.router.getCurrentNavigation().extras.state.entity.id;
      }
    });
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

  enroll() {
    const transactionOptions = new TransactionOptions();

    // TODO: the amount should not be hardcoded
    transactionOptions.amountInCents = this.platformAmount;
    transactionOptions.meetingId = this.meetingId;
    // TODO: Don't rely on the server to ignore duplicate transactions
    this.stripePayments.authorizeTransaction(transactionOptions).subscribe(t => {
      this.eventService.enroll(this.meetingId).subscribe(r => {
          if (!r) {
            console.log('User is already enrolled');
          }

          // TODO: should we navigate to meeting or should we just change the view state of the current page
          // this.navigateToMeeting(this.meetingId);
      });
    });
  }
}
