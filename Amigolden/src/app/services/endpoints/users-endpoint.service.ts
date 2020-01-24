import { Injectable } from '@angular/core';
import { User } from '../../models/user';
import { ApiResourceBaseService } from '../api-resource-base/api-resource-base.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProfilePictureService } from '../documents/profile-picture.service';

@Injectable({
  providedIn: 'root'
})
export class UsersEndpointService extends ApiResourceBaseService<User>  {
    constructor(protected http: HttpClient, protected profilePictureService: ProfilePictureService) {
        super(http, 'users');
  }

  getVoteCandidates(meetingId: number): Observable<User[]> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');

    const url = `${this.apiUrl}/${this.route}/vote-candidates/${meetingId}?`;

    return this.http.get<User[]>(url, { headers });
  }

  mapEntity(entity: User): User {
    if (entity.profilePictureId == null) {
        entity.profilePictureUrl = 'http://modexenergy.com/wp-content/themes/modex_wp/img/avatar.png';
    }

    this.profilePictureService.setProfilePictureUrl(entity);

    return entity;
  }
}

