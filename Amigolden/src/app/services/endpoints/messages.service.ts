import { Injectable } from '@angular/core';
import { Message } from 'src/app/models/message';
import { ApiResourceBaseService } from '../api-resource-base/api-resource-base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessagesService extends ApiResourceBaseService<Message> {

  constructor(protected httpClient: HttpClient) {
    super(httpClient, 'messages');
  }
}
