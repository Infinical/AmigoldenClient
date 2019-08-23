import { Injectable } from '@angular/core';
import { User } from '../../models/user';
import { ApiResourceBaseService } from '../api-resource-base/api-resource-base.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersEndpointService extends ApiResourceBaseService<User>  {
    constructor(protected http: HttpClient) {
        super(http, 'users');
  }

  getByMeetingId(meetingId: number): Observable<User[]> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');

    const url = `${this.apiUrl}/${this.route}/ByMeeting/${meetingId}?`;

    return this.http.get<User[]>(url, { headers });
  }

  mapEntity(entity: User): User {
    if (entity.profilePictureId == null) {
        entity.profilePictureUrl = 'http://modexenergy.com/wp-content/themes/modex_wp/img/avatar.png';
    }

    return entity;
  }
}

