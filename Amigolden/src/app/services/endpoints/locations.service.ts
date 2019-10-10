import { Injectable } from '@angular/core';
import { Message } from 'src/app/models/message';
import { ApiResourceBaseService } from '../api-resource-base/api-resource-base.service';
import { HttpClient } from '@angular/common/http';
import { Location } from 'src/app/models/location';


@Injectable({
  providedIn: 'root'
})
export class LocationsService extends ApiResourceBaseService<Location> {

  constructor(protected httpClient: HttpClient) {
    super(httpClient, 'locations');
  }
}
