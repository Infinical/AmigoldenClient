import { Component, OnInit } from '@angular/core';
import { HubServiceBase } from 'src/app/services/hubs/hub-base.service';

@Component({
  selector: 'app-messages-list',
  templateUrl: './messages-list.page.html',
  styleUrls: ['./messages-list.page.scss'],
  providers: [ HubServiceBase ]
})
export class MessagesListPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
