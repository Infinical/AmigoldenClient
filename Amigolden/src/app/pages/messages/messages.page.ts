import { NgZone, ViewChild, Component, OnInit } from '@angular/core';
import moment from 'moment';
import { EditOptions } from '../../models/edit-options';
import { Conversation } from '../../models/conversation';
import { Message } from '../../models/Message';
import { ODataDynamicFilterBuilder, ODataPropertyPath } from '../../models/OData/Filter/ts-odata-dynamic-filter';
import { Identity } from 'src/app/services/identity/identity.service';
import { MessagesService } from 'src/app/services/endpoints/messages.service';
import { HubServiceBase } from 'src/app/services/hubs/hub-base.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ListConfiguration, PagingInfo } from 'src/app/components/list-base/data/list-configuration';
import { map } from 'rxjs/operators';
import { ListBaseComponent } from 'src/app/components/list-base/list-base.component';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
  providers: [ HubServiceBase ]
})
export class MessagesPage implements OnInit {

    // @ViewChild('content') content: any;

    @ViewChild('pageListBase', undefined) pageListBase: ListBaseComponent<Message>;

    pageSize = 20;
    pageNumber = 1;

    private conversation: Conversation;

    filterByConversationId: string;

    messageText: string;

    canSendMessage: boolean;

    editOptions = new EditOptions();

    public config = new ListConfiguration<Message>(
      (pagingInfo: PagingInfo) =>
      this.baseProvider.getDynamicList(this.filterByConversationId,
        pagingInfo.pageSize, pagingInfo.pageNumber).pipe(map(message => {
            this.setOwnerClassPrefix(message);
            return message;
        })),
      {
        onItemClick: (entity) => {},
        isReverse: true
      }
    );

    constructor(protected baseProvider: MessagesService, protected identityProvider: Identity,
                protected hubService: HubServiceBase, protected ngZone: NgZone,
                protected route: ActivatedRoute, protected router: Router) {
        this.hubService.initialize('messages').then(() => {
            this.hubService.registerOnServerEvents();
            this.subscribeToHubEvents();
            this.canSendMessage = this.hubService.connectionExists;
        });
    }

    ngOnInit() {
      this.route.queryParams.subscribe(params => {
        if (this.router.getCurrentNavigation().extras.state) {
          this.conversation = this.router.getCurrentNavigation().extras.state.entity;
          // Have the conversations controller handle creating conversation
          this.filterByConversationId = ODataDynamicFilterBuilder.build(builder =>
            builder.eq(new ODataPropertyPath('ConversationId'), this.conversation.id)).getString();
        }
      });
    }

    scrollToBottom() {
        // setTimeout(() => {app
        //     this.content.scrollToBottom();
        // });
    }

    getCreated = (date: Date) => {
        return moment(date).fromNow();
    }

    setOwnerClassPrefix(entity: any) {

        if (!entity) {
            return;
        }

        this.identityProvider.getCurrentUser().then(u => {
            entity.$$owner = (u.id.toString() === entity.senderUserId ? 'mine' : 'other');
        }).catch(err => {
            console.log(err);
        });
    }

    private subscribeToHubEvents(): void {
        this.hubService.connectionEstablished.subscribe(() => {
            this.canSendMessage = true;
        });

        this.hubService.onCreate.subscribe((message: Message) => {
            this.ngZone.run(() => {
                this.setOwnerClassPrefix(message);
                this.pageListBase.entityList.push(message);
            });
        });
    }

    sendTextMessage(): void {
        // If message was yet to be typed, abort
        if (!this.messageText) {
            return;
        }

        this.identityProvider.getCurrentUser().then(user => {

            const messageEntity = new Message();
            messageEntity.conversationId = this.conversation.id;
            messageEntity.senderUserId = user.id;
            messageEntity.created = new Date();
            messageEntity.messageText = this.messageText;

            this.baseProvider.create(messageEntity).subscribe(entity => {
                // No need to append hubs will take care of this
            });

            this.messageText = null;
        });
    }
}
