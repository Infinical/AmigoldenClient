import { Component, OnInit, KeyValueDiffers, NgZone, ViewChild } from '@angular/core';
import { HubServiceBase } from 'src/app/services/hubs/hub-base.service';
import { Conversation } from 'src/app/models/conversation';
import { ListBaseComponent } from 'src/app/components/list-base/list-base.component';
import moment from 'moment';
import { ConversationsService } from 'src/app/services/endpoints/conversations.service';
import { ListConfiguration, SlidingListConfiguration, PagingInfo } from 'src/app/components/list-base/data/list-configuration';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-messages-list',
  templateUrl: './messages-list.page.html',
  styleUrls: ['./messages-list.page.scss'],
  providers: [ HubServiceBase ]
})
export class MessagesListPage implements OnInit {

  @ViewChild('pageListBase', undefined) pageListBase: ListBaseComponent<any>;

  config = new ListConfiguration<Conversation>((pagingInfo: PagingInfo) =>
    this.baseProvider.getList(pagingInfo.pageSize, pagingInfo.pageNumber).pipe(map(t => t.items)),
    {
      slidingListConfig: new SlidingListConfiguration((entityId) =>  this.baseProvider.unsubscribe(entityId))
    });

  constructor(public baseProvider: ConversationsService, public differs: KeyValueDiffers,
              public hubService: HubServiceBase, private ngZone: NgZone) {
  }

  ngOnInit() {
    this.hubService.initialize('conversations').then(() => {
      this.hubService.registerOnServerEvents();
      this.subscribeToHubEvents();
    });
  }

  getMomentDate(date: Date) {
    if (date == null) {
      return '';
    }

    return moment(date).fromNow();
  }

  navigateToDetail(entity: Conversation) {
  }

  private subscribeToHubEvents(): void {
    this.hubService.onCreate.subscribe((entity: Conversation) => {
        this.ngZone.run(() => {
            this.pageListBase.entityList.push(entity);
        });
    });
  }
}
