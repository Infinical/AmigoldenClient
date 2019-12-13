import { Component, OnInit } from '@angular/core';
import { ListConfiguration, PagingInfo } from 'src/app/components/list-base/data/list-configuration';
import { User } from 'src/app/models/user';
import { UsersEndpointService } from 'src/app/services/endpoints/users-endpoint.service';
import { PageBase } from '../../detail-page-base';
import { ActivatedRoute, Router } from '@angular/router';
import { DestinationTransactionOptions } from 'src/app/models/transactions-info';
import { StripePaymentsService } from 'src/app/services/endpoints/stripe-payments.service';
import { EventsService } from 'src/app/services/endpoints/events.service';

@Component({
  selector: 'app-vote-list',
  templateUrl: './vote-list.page.html',
  styleUrls: ['./vote-list.page.scss'],
})
export class VoteListPage extends PageBase implements OnInit {

  eventCostInCents: number;
  transactionOptions: DestinationTransactionOptions;
  public config = new ListConfiguration<User>(
    (pagingInfo: PagingInfo) => this.userService.getByMeetingId(this.entityId),
    { isSinglePage: true }
  );

  constructor(protected route: ActivatedRoute, router: Router,
              protected userService: UsersEndpointService,
              protected stripePayments: StripePaymentsService,
              protected eventService: EventsService) {
      super(route, router);
      stripePayments.getTransaction(this.entityId).subscribe(t => this.transactionOptions = t);
      eventService.getDefaultEventCost(this.entityId).subscribe(eventCost => this.eventCostInCents = eventCost);
   }

  ngOnInit() {
  }

  isVotedCastedFor(user: User) {
     // TODO: check vote api
     return user.id === this.transactionOptions.userId;
  }


  vote(entity: User) {
    this.transactionOptions.userId = entity.id;
    this.transactionOptions.amountInCents = this.eventCostInCents;
    this.stripePayments.authorizeDestinationTransaction(this.transactionOptions).subscribe((options) => {
      this.transactionOptions = options;
    });
  }

}
