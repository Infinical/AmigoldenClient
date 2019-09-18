import { Injectable } from '@angular/core';
import { Conversation } from '../../models/conversation';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiResourceBaseService } from '../api-resource-base/api-resource-base.service';

@Injectable({
  providedIn: 'root'
})
export class ConversationsService extends ApiResourceBaseService<Conversation>  {
  constructor(public http: HttpClient) {
      super(http, 'conversations');
  }

  // TODO: rename properties in conversation
  // TODO: make conversations subscription
  getOrCreateNew(receiverId: number): Observable<Conversation> {
      return this.getByRoute(`GetOrCreate?sendTo=${receiverId}`);
  }

  unsubscribe(conversationId: number): Observable<boolean> {

      const headers = new HttpHeaders();
      headers.append('Content-Type', 'application/json');

      return  this.http.post<boolean>(`${this.apiUrl}/${this.route}/unsubscribe?conversationId=${conversationId}`, null, {
          headers
      });
  }

  mapEntity(entity: Conversation): Conversation {
    if (entity.primaryRecipient.profilePictureId == null) {
        entity.primaryRecipient.profilePictureUrl = 'http://modexenergy.com/wp-content/themes/modex_wp/img/avatar.png';
    }

    return entity;
  }
}
